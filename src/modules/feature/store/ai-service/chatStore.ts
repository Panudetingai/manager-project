import { ChatStatus, UIDataTypes, UIMessage, UITools } from "ai";
import { create } from "zustand";
import { AIToolsPostsOutput, ModelsType } from "../../types/ai-service/ai-service-type";

interface ChatStoreState {
  messages: UIMessage<unknown, UIDataTypes, UITools>[];
  setMessage: (message: UIMessage<unknown, UIDataTypes, UITools>[]) => void;
  status?: ChatStatus | undefined;
  setStatus: (status: ChatStatus | undefined) => void;
  error: Error | undefined;
  seterror: (error: Error | string) => void;
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
    set(() => ({ error : typeof error === "string" ? new Error(error) : error }));
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

interface ChatStoreAffiliate {
  Show: boolean;
  setShow: (show: boolean) => void;
  showType: "document" | "Posts" | "none";
  setShowType: (type: "document" | "Posts" | "none") => void;
}

export const useChatStoreAffiliate = create<ChatStoreAffiliate>((set) => ({
  Show: false,
  showType: "none",
  setShow: (show) => set(() => ({ Show: show })),
  setShowType: (type) => set(() => ({ showType: type })),
}));


interface ChatStorePost extends AIToolsPostsOutput {
  setPostData: (data: Partial<AIToolsPostsOutput>) => void;
}

export const useChatStorePost = create<ChatStorePost>((set) => ({
  title: "",
  images: [],
  content: "",
  category: "",
  tags: [],
  provider: "",
  setPostData: (data: Partial<AIToolsPostsOutput>) =>
    set(() => ({
      title: data.title || "",
      images: data.images || [],
      content: data.content || "",
      category: data.category || "",
      tags: data.tags || [],
      provider: data.provider || "",
    })),
}));