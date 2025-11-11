import { UIDataTypes, UIMessage, UITools } from "ai";

export type PayloadConversation = {
  generateId: string;
  payload: {
    message: UIMessage<unknown, UIDataTypes, UITools>;
    messages: UIMessage<unknown, UIDataTypes, UITools>[];
    isAbort: boolean;
    isDisconnect: boolean;
    isError: boolean;
  };
};