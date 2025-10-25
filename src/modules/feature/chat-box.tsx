"use client";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence } from "motion/react";
import React, { Fragment, useEffect } from "react";
import { AIServiceTypeOption } from "../ai-service/ai.service";
import ChatEmpty from "./(chat-ai)/chat-empty";
import ImagePreview from "./(chat-ai)/image-input";
import PromptInputBox from "./(chat-ai)/prompt-input";
import TextResponse, {
  MessageErrorResponse,
  ThinkingMessage,
} from "./(chat-ai)/text-reponse";
import { useChatControls } from "./store/ai-service/chatStore";
function Chatbox() {
  const { modal, modalType, webSearch } = useChatControls();
  const reasoningRef = React.useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    experimental_throttle: 200,
    transport: new DefaultChatTransport({
      api: "/api/ai-service/chat",
      body: {
        generatetype: webSearch ? "search" : "chat",
        typeai: modalType,
        options: {
          model: modal,
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      } as AIServiceTypeOption,
    }),
  });

  useEffect(() => {
    if (reasoningRef.current) {
      setTimeout(() => {
        reasoningRef.current?.scrollTo({
          top: reasoningRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, []);

  return (
    <div className={`flex flex-col gap-4`}>
      <div className="relative size-full max-h-[70vh] h-[70vh]">
        <div className="flex flex-col h-full">
          <Conversation>
            <ConversationContent>
              {messages.length === 0 && status !== "submitted" && (
                <ConversationEmptyState className="justify-start items-start p-0">
                  <ChatEmpty />
                </ConversationEmptyState>
              )}
              {messages.map((message, messageIndex) => (
                <Fragment key={messageIndex}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        const isLastMessage = i === message.parts.length - 1;
                        return (
                          <TextResponse
                            key={i}
                            index={i}
                            message={message}
                            partText={part}
                            isLastMessage={isLastMessage}
                          />
                        );
                      case "file":
                        return (
                          <ImagePreview
                            i={`${message.id}-${i}`}
                            message={message}
                            part={part}
                          />
                        );
                      case "reasoning":
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className="w-full"
                            isStreaming={i === message.parts.length - 1}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent ref={reasoningRef}>
                              {part.text}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      default:
                        return null;
                    }
                  })}
                </Fragment>
              ))}
              <AnimatePresence mode="wait">
                {status === "submitted" && <ThinkingMessage key="thinking" />}
              </AnimatePresence>
              <AnimatePresence>
                {status === "error" && (
                  <MessageErrorResponse key={"messageError"} />
                )}
              </AnimatePresence>
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1 sticky bottom-2 w-full bg-background">
        <PromptInputBox sendMessage={sendMessage} status={status} />
      </div>
    </div>
  );
}

export default React.memo(Chatbox);
