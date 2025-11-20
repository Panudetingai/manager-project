import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { TextUIPart, UIDataTypes, UIMessage, UITools } from "ai";
import { CopyIcon, RefreshCcwIcon, SparklesIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { Fragment } from "react";
import { useChatStore } from "../store/ai-service/chatStore";
type Props = {
  message: UIMessage<unknown, UIDataTypes, UITools>;
  partText: TextUIPart;
  index: number;
  // regenerate: () => void;
  isLastMessage: boolean;
};

export const markdown = `React hooks are special functions that let you use React features in function components. The most common ones are:

- **useState** - for managing component state
- **useEffect** - for side effects like data fetching
- **useContext** - for consuming context values
- **useRef** - for accessing DOM elements

Here's a simple example:

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

Which specific hook would you like to learn more about?`;

function TextResponse({
  index,
  message,
  partText,
  // regenerate,
  isLastMessage,
}: Props) {
  console.log(partText.text);

  return (
    <Fragment key={index}>
      <Message from={message.role}>
        <MessageContent key={message.id}>
          <MessageResponse>{partText.text}</MessageResponse>
        </MessageContent>
      </Message>
      {isLastMessage && (
        <MessageActions>
          <MessageAction label="Retry">
            <RefreshCcwIcon className="size-3" />
          </MessageAction>
          <MessageAction
            onClick={() => navigator.clipboard.writeText(partText.text)}
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
