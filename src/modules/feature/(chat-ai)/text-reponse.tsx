import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { UIMessage } from "ai";
import { CopyIcon, RefreshCcwIcon, SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { Fragment } from "react";
import { useChatStore } from "../store/ai-service/chatStore";
import { normalizeMarkdown } from "../utils/sanitizeText";

type Props = {
  id: string;
  role: UIMessage["role"];
  partText: string;
  // regenerate: () => void;
  isLastMessage: boolean;
};

export const markdown = `Hello...\\n\\n\`\`\`python\\nprint(1)\\n\`\`\``;

function TextResponse({
  role,
  id,
  partText,
  // regenerate,
  isLastMessage,
}: Props) {

  return (
    <Fragment>
      <Message from={role}>
        <MessageContent>
          <MessageResponse>
            {normalizeMarkdown(partText)}
          </MessageResponse>
        </MessageContent>
      </Message>
      {isLastMessage && (
        <MessageActions>
          <MessageAction label="Retry">
            <RefreshCcwIcon className="size-3" />
          </MessageAction>
          <MessageAction
            onClick={() => navigator.clipboard.writeText(partText)}
            label="Copy"
          >
            <CopyIcon className="size-3" />
          </MessageAction>
        </MessageActions>
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
          <div className="p-0 text-muted-foreground text-sm">Thinking...</div>
        </div>
      </div>
    </motion.div>
  );
};

export const MessageErrorResponse = () => {
  const role = "assistant";
  const { error } = useChatStore();
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
          <div className="p-0 text-sm text-destructive">
            {typeof error === "string"
              ? error
              : error instanceof Error
              ? error.message
              : ""}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(TextResponse);
