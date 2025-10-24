import { ChatStatus, UIDataTypes, UIMessage, UITools } from "ai";
import { create } from "zustand";

interface ChatStoreState {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  setMessage: (message: UIMessage<unknown, UIDataTypes, UITools>[]) => void;
  status?: ChatStatus | undefined;
  setStatus: (status: ChatStatus | undefined) => void;
  error: Error | undefined;
  seterror: (error: Error) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  messages: [],
  status: undefined,
  error: undefined,
  setMessage: (message) => set(() => ({ messages: message })),
  setStatus: (status) => {
    set(() => ({ status: status }));
  },
  seterror: (error) => {
    set(() => ({ error }));
  },
}));
