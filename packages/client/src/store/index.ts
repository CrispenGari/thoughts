import { UserType, NotificationType } from "@thoughts/api/src/types";
import { create } from "zustand";

export const useMeStore = create<{
  me: UserType | null;
  setMe: (me: UserType | null) => void;
}>((set) => ({
  me: null,
  setMe: (me) => set({ me }),
}));

export const useCountryCodeStore = create<{
  code: string | null;
  setCode: (code: string | null) => void;
}>((set) => ({
  code: null,
  setCode: (code) => set({ code }),
}));

interface NType {
  read?: NotificationType[];
  unread?: NotificationType[];
}
export const useNotificationsStore = create<{
  notifications: NType;
  setNotifications: (notifications: NType) => void;
}>((set) => ({
  notifications: { read: undefined, undefined: undefined },
  setNotifications: (notifications) => set({ notifications }),
}));

export const useSubscriptionsStore = create<{
  user: number | null;
  thought: {
    userId: number;
    thoughtId: number;
  } | null;
  setThought: (
    thought: {
      userId: number;
      thoughtId: number;
    } | null
  ) => void;
  setUser: (id: number | null) => void;
}>((set) => ({
  user: null,
  thought: null,
  setUser: (id) => set({ user: id }),
  setThought: (thought) => set({ thought }),
}));
