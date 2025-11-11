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
import { useUserClient } from "@/lib/supabase/getUser-client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIDataTypes, UIMessage, UITools } from "ai";
import { AnimatePresence } from "motion/react";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect } from "react";
import { AIServiceTypeOption } from "../ai-service/ai.service";
import { getConversationById } from "../ai-service/server/api";
import ChatEmpty from "./(chat-ai)/chat-empty";
import ImagePreview from "./(chat-ai)/image-input";
import PromptInputBox from "./(chat-ai)/prompt-input";
import TextResponse, {
  MessageErrorResponse,
  ThinkingMessage,
} from "./(chat-ai)/text-reponse";
import { useChatControls } from "./store/ai-service/chatStore";

function ChatBox() {
  const { modal, modalType } = useChatControls();
  const reasoningRef = React.useRef<HTMLDivElement>(null);
  const data = useUserClient();
  const { id } = useParams();

  const { messages, setMessages, sendMessage, status } = useChat({
    experimental_throttle: 100,
    transport: new DefaultChatTransport({
      api: "/api/ai-service/chat",
      body: {
        userid: data?.data?.id,
        typeai: modalType,
        generatetype: "chat",
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

  useEffect(() => {
    if (!id) return;
    const messageHistory = async () => {
      const messagesHistory = await getConversationById(id as string);
      if (messagesHistory.messages) {
        // eslint-disable-next-line
        setMessages(messagesHistory.messages as any);
      } 
    };
    messageHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  console.log(messages);

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
              {messages
                .flat()
                .filter(
                  (message) =>
                    message &&
                    typeof message === "object" &&
                    !Array.isArray(message) &&
                    Array.isArray(message.parts)
                )
                .map((message, messageIndex) => (
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
                              i={`${i}`}
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

export default React.memo(ChatBox);
