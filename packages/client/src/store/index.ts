import { UserType, NotificationType } from "@thoughts/api/src/types";
import pako from "pako";
import { Buffer } from "buffer";
import { create } from "zustand";

export const useMeStore = create<{
  me: UserType | null;
  setMe: (me: UserType | null) => void;
}>((set) => ({
  me: null,
  setMe: (me) => set({ me }),
}));
export const useContactsStore = create<{
  contacts: string;
  setContacts: (contacts: string) => void;
}>((set) => ({
  contacts: "",
  setContacts: (contacts) => {
    const buffer = pako.deflate(contacts, {});
    const zipped = Buffer.from(buffer).toString("base64");
    return set({ contacts: zipped });
  },
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
  block: number | null;
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
  setBlock: (id: number | null) => void;
}>((set) => ({
  block: null,
  user: null,
  thought: null,

  setUser: (id) => set({ user: id }),
  setThought: (thought) => set({ thought }),
  setBlock: (id) => set({ block: id }), // for the blocks of the user
}));
