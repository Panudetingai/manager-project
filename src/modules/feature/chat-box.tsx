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
import { ChatStatus } from "ai";
import { SparkleIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Fragment } from "react";
import PromptInputBox from "./(chat-ai)/prompt-input";
import TextResponse, { MessageErrorResponse, ThinkingMessage } from "./(chat-ai)/text-reponse";
import { useChatStore } from "./store/ai-service/chatStore";

export default function Chatbox() {
  const {messages, status} = useChatStore()

  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex-1">
        <h1 className="font-semibold text-xl">Welcome to ChatServiceAI</h1>
        <p className="text-muted-foreground">
          Start a conversation with our AI-powered chat service.
        </p>
      </div>
      <div className="relative flex size-full flex-col divide-y overflow-y-auto ">
        <div className="flex flex-col">
          <Conversation  className="relative w-full" style={{ height: '500px' }}>
            <ConversationContent className="flex flex-col gap-4 min-h-[60vh] max-h-[60vh] md:max-h-[70vh] lg:max-h-[65vh] xl:max-h-[75vh] xl:min-h-[75vh] overflow-y-auto">
              {messages.length === 0 && status !== "submitted" && (
                <ConversationEmptyState
                  title="No messages yet"
                  description="Type a message below to start the conversation."
                  icon={<SparkleIcon />}
                />
              )}
              {messages.map((message, messageIndex) => (
                <Fragment key={messageIndex}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        const isLastMessage = i === message.parts.length - 1;
                        return (
                          <TextResponse
                            status={status as ChatStatus}
                            key={i}
                            index={i}
                            message={message}
                            partText={part}
                            // regenerate={() => handleRegenerate("")}
                            isLastMessage={isLastMessage}
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
                            <ReasoningContent>{part.text}</ReasoningContent>
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
                {status === "error" && <MessageErrorResponse key={"messageError"} />}
              </AnimatePresence>
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1 sticky bottom-2 w-full bg-background">
        <PromptInputBox />
      </div>
    </div>
  );
}
