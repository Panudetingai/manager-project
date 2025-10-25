import { Action, Actions } from "@/components/ai-elements/actions";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { useAccountClient } from "@/lib/supabase/getUser-client";
import { ChatStatus, TextUIPart, UIDataTypes, UIMessage, UITools } from "ai";
import { CopyIcon, RefreshCcwIcon, SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import { Fragment } from "react";
import { useChatStore } from "../store/ai-service/chatStore";
import { sanitizeText } from "../utils/sanitizeText";
type Props = {
  message: UIMessage<unknown, UIDataTypes, UITools>;
  partText: TextUIPart;
  index: number;
  // regenerate: () => void;
  isLastMessage: boolean;
  status: ChatStatus;
};

export default function TextResponse({
  message,
  status,
  partText,
  // regenerate,
  isLastMessage,
}: Props) {
  const user = useAccountClient();
  return (
    <Fragment>
      <Message from={message.role}>
        <MessageContent
          className={`${
            message.role === "user" ? "rounded-full" : ""
          } px-3 py-2`}
          variant={message.role === "user" ? "contained" : "flat"}
        >
          <Response
            isAnimating={
              isLastMessage &&
              message.role === "assistant" &&
              (status === "submitted" ||
                status === "streaming" ||
                status === "ready")
            }
          >
            {sanitizeText(partText.text)}
          </Response>
        </MessageContent>
        {message.role === "user" && (
          <MessageAvatar
            name={
              message.role === "user"
                ? user.data?.username ?? "User"
                : "ChatServiceAI"
            }
            src={message.role === "user" ? user.data?.avatar_url ?? "" : ""}
          />
        )}
      </Message>
      {message.role === "assistant" && isLastMessage && (
        <Actions>
          <Action label="Retry">
            <RefreshCcwIcon className="size-3" />
          </Action>
          <Action
            onClick={() => navigator.clipboard.writeText(partText.text)}
            label="Copy"
          >
            <CopyIcon className="size-3" />
          </Action>
        </Actions>
      )}
    </Fragment>
  );
}

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="group/message w-full"
      data-role={role}
      data-testid="message-assistant-loading"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-start gap-3">
        <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex w-full flex-col gap-2 md:gap-4">
          <div className="p-0 text-muted-foreground text-sm">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const MessageErrorResponse = () => {
  const role = "assistant";
  const {error} = useChatStore()
  return (
     <motion.div
      animate={{ opacity: 1 }}
      className="group/message w-full"
      data-role={role}
      data-testid="message-assistant-loading"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-start gap-3">
        <div className="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex w-full flex-col gap-2 md:gap-4">
          <div className="p-0 text-muted-foreground text-sm">
            {error?.message}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
