"use client";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { useChat } from "@ai-sdk/react";
import {
  UIDataTypes,
  UIMessage,
  UITools
} from "ai";
import { Fragment, useState } from "react";
import PromptInputBox from "./(chat-ai)/prompt-input";
import TextResponse from "./(chat-ai)/text-reponse";

export default function Chatbox() {
  const [messages, setMessages] = useState<UIMessage<unknown, UIDataTypes, UITools>[]>([]);
  const { regenerate } = useChat();
  const handleRegenerate = (messageId: string) => {
    regenerate({ messageId: messageId });
  };

  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex-1">
        <h1 className="font-semibold text-xl">Welcome to ChatServiceAI</h1>
        <p className="text-muted-foreground">
          Start a conversation with our AI-powered chat service.
        </p>
      </div>
      <div className="relative flex size-full flex-col divide-y overflow-hidden lg:h-[510px]">
        <div className="flex flex-col w-full">
          <Conversation>
            <ConversationContent>
              {messages.map((message, messageIndex) => (
                <Fragment key={messageIndex}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        const isLastMessage =
                          i === message.parts.length - 1;
                        return (
                          <TextResponse
                            key={i}
                            index={i}
                            message={message}
                            partText={part}
                            regenerate={() => handleRegenerate("")}
                            isLastMessage={isLastMessage}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </Fragment>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1 sticky bottom-2 w-full bg-background">
        <PromptInputBox setMessageStream={setMessages} />
      </div>
    </div>
  );
}
