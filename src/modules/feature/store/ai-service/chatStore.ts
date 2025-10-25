import { ChatStatus, UIDataTypes, UIMessage, UITools } from "ai";
import { create } from "zustand";
import { ModelsType } from "../../types/ai-service/ai-service-type";

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

interface ChatControls {
  modalType: ModelsType['type'];
  setModalType: (type: ModelsType['type']) => void;
  modal: ModelsType['id'];
  setModal: (model: ModelsType['id']) => void;
  webSearch?: boolean;
  setWebSearch?: (useSearch: boolean) => void;
}

export const useChatControls = create<ChatControls>((set) => ({
  modalType: 'groq',
  modal: 'groq/compound',
  webSearch: false,
  setModalType: (type) => set(() => ({ modalType: type })),
  setModal: (model) => set(() => ({ modal: model })),
  setWebSearch: (useSearch) => set(() => ({ webSearch: useSearch })),
}));
