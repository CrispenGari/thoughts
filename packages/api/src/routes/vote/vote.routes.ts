import EventEmitter from "events";
import { Events } from "../../constants";
import { publicProcedure, router } from "../../trpc";

import { NotificationType, VoteType } from "../../types";
import { observable } from "@trpc/server/observable";
import { Reply } from "../../sequelize/reply.model";
import { Comment } from "../../sequelize/comment.model";
import { Vote } from "../../sequelize/vote.model";
import {
  commentVoteSchema,
  onCommentVoteSchema,
  onNewCommentVoteNotificationSchema,
  onNewReplyVoteNotificationSchema,
  onReplyVoteSchema,
  replyVoteSchema,
} from "../../schema/vote.schema";
import { Notification } from "../../sequelize/notification.model";

const ee = new EventEmitter();
export const voteRouter = router({
  onNewCommentVoteNotification: publicProcedure
    .input(onNewCommentVoteNotificationSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<NotificationType>((emit) => {
        const handler = (payload: NotificationType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_NEW_COMMENT_VOTE_NOTIFICATION, handler);
        return () => {
          ee.off(Events.ON_NEW_COMMENT_VOTE_NOTIFICATION, handler);
        };
      });
    }),
  onNewReplyVoteNotification: publicProcedure
    .input(onNewReplyVoteNotificationSchema)
    .subscription(async ({ input: { userId } }) => {
      return observable<NotificationType>((emit) => {
        const handler = (payload: NotificationType) => {
          if (payload.userId === userId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_NEW_REPLY_VOTE_NOTIFICATION, handler);
        return () => {
          ee.off(Events.ON_NEW_REPLY_VOTE_NOTIFICATION, handler);
        };
      });
    }),
  onCommentVote: publicProcedure
    .input(onCommentVoteSchema)
    .subscription(async ({ input: { commentId } }) => {
      return observable<VoteType>((emit) => {
        const handler = (payload: VoteType) => {
          if (payload.commentId === commentId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_COMMENT_VOTE, handler);
        return () => {
          ee.off(Events.ON_COMMENT_VOTE, handler);
        };
      });
    }),
  onReplyVote: publicProcedure
    .input(onReplyVoteSchema)
    .subscription(async ({ input: { replyId } }) => {
      return observable<VoteType>((emit) => {
        const handler = (payload: VoteType) => {
          if (payload.replyId === replyId) {
            emit.next(payload);
          }
        };
        ee.on(Events.ON_REPLY_VOTE, handler);
        return () => {
          ee.off(Events.ON_REPLY_VOTE, handler);
        };
      });
    }),

  commentVote: publicProcedure
    .input(commentVoteSchema)
    .mutation(async ({ ctx: { me }, input: { commentId } }) => {
      try {
        if (!!!me) return { success: false };
        const vote = await Vote.findOne({
          where: {
            userId: me.id,
            commentId,
          },
        });
        if (!!vote) {
          await vote.destroy();
          await Comment.decrement("voteCount", {
            by: 1,
            where: {
              id: commentId,
            },
          });
          ee.emit(Events.ON_COMMENT_VOTE, vote.toJSON());
          return { success: true };
        }
        const _newVote = await Vote.create(
          { userId: me.id!, commentId },
          {
            include: { all: true },
          }
        );
        console.log(_newVote.toJSON());

        await Comment.increment("voteCount", {
          by: 1,
          where: {
            id: commentId,
          },
        });
        const cmt = await Comment.findByPk(_newVote.toJSON().commentId, {
          include: ["user"],
        });
        if (cmt && cmt.toJSON().userId !== me.id) {
          const notification = await Notification.create({
            title: `voted on your comment.`,
            thoughtId: cmt.toJSON().thoughtId,
            userId: cmt.toJSON().userId,
            read: false,
            type: "comment_reaction",
          });
          ee.emit(
            Events.ON_NEW_COMMENT_VOTE_NOTIFICATION,
            notification.toJSON()
          );
        }
        ee.emit(Events.ON_COMMENT_VOTE, _newVote.toJSON());
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),
  replyVote: publicProcedure
    .input(replyVoteSchema)
    .mutation(async ({ ctx: { me }, input: { replyId } }) => {
      try {
        if (!!!me) return { success: false };
        const vote = await Vote.findOne({
          where: {
            userId: me.id,
            replyId,
          },
        });
        if (!!vote) {
          await vote.destroy();
          await Reply.decrement("voteCount", {
            by: 1,
            where: {
              id: replyId,
            },
          });
          ee.emit(Events.ON_REPLY_VOTE, vote.toJSON());
          return { success: true };
        }
        const _newVote = await Vote.create(
          { userId: me.id!, replyId },
          {
            include: ["reply"],
          }
        );
        await Reply.increment("voteCount", {
          by: 1,
          where: {
            id: replyId,
          },
        });
        const cmt = await Reply.findByPk(_newVote.toJSON().replyId, {
          include: ["user", "comment"],
        });

        if (cmt && cmt.toJSON().userId !== me.id) {
          const notification = await Notification.create({
            title: `voted on your comment reply.`,
            thoughtId: cmt.toJSON()?.comment?.thoughtId,
            userId: cmt.toJSON().userId,
            read: false,
            type: "reply_reaction",
          });
          ee.emit(Events.ON_NEW_REPLY_VOTE_NOTIFICATION, notification.toJSON());
        }

        ee.emit(Events.ON_REPLY_VOTE, _newVote.toJSON());
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),
});
