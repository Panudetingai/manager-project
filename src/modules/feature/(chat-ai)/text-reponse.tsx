import { Action, Actions } from "@/components/ai-elements/actions";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { useAccountClient } from "@/lib/supabase/getUser-client";
import { TextUIPart, UIDataTypes, UIMessage, UITools } from "ai";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Fragment } from "react";

type Props = {
  message: UIMessage<unknown, UIDataTypes, UITools>;
  partText: TextUIPart;
  index: number;
  regenerate: () => void;
  isLastMessage: boolean;
};

export default function TextResponse({
  message,
  partText,
  regenerate,
  isLastMessage,
}: Props) {
  const user = useAccountClient();
  return (
    <Fragment>
      <Message from={message.role}>
        <MessageContent>
          <Response>{partText.text}</Response>
        </MessageContent>
        <MessageAvatar
          name={
            message.role === "user"
              ? user.data?.username ?? "User"
              : "ChatServiceAI"
          }
          src={
            message.role === "user" ? user.data?.avatar_url ?? "" : "/logo.svg"
          }
        />
      </Message>
      {message.role === "assistant" && isLastMessage && (
        <Actions>
          <Action onClick={() => regenerate()} label="Retry">
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
