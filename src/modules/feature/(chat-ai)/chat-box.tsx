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
import { AnimatePresence, motion } from "motion/react";
import React, { Fragment, useEffect, useState } from "react";
import PostAffiliate from "../(post-manager)/components/post-affiliatte";
import { AIServiceTypeOption } from "../../ai-service/ai.service";
import { useConversationAPI } from "../../ai-service/hooks/action";
import {
  useChatControls,
  useChatStore,
  useChatStoreAffiliate,
} from "../store/ai-service/chatStore";
import { AIToolsPostsOutput } from "../types/ai-service/ai-service-type";
import ChatEmpty from "./chat-empty";
import ChatboxLoading from "./chatbox-loading";
import ImagePreview from "./image-input";
import PromptInputBox from "./prompt-input";
import TextResponse, {
  MessageErrorResponse,
  ThinkingMessage,
} from "./text-reponse";

interface ChatBoxProps {
  params: {
    id?: Promise<string>;
  };
}

function ChatBox({ params }: ChatBoxProps) {
  const { modal, modalType } = useChatControls();
  const [generateId, setGenerateId] = useState<string>("");
  const reasoningRef = React.useRef<HTMLDivElement>(null);
  const { Show } = useChatStoreAffiliate();
  const { seterror } = useChatStore();
  const { mutate: saveConversation } =
    useConversationAPI.useSaveConversationAPI();

  const generateIdRef = React.useRef<string>("");
  let getConversation: ReturnType<
    typeof useConversationAPI.useGetConversationByIdAPI
  > | null = null;
  if (params?.id) {
    getConversation = useConversationAPI.useGetConversationByIdAPI(
      params?.id || generateId
    );
  }

  const { messages, setMessages, sendMessage, status } = useChat({
    experimental_throttle: 100,
    transport: new DefaultChatTransport({
      api: "/api/ai-service/chat",
      body: {
        typeai: modalType,
        generatetype: "chat",
        options: {
          model: modal,
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      } as AIServiceTypeOption,
    }),
    onFinish: async (response) => {
      const id = params?.id || generateIdRef.current;
      if (id) {
        saveConversation({
          payload: {
            generateId: await id,
            payload: response,
          },
        });
      }
    },
    onError: (err) => {
      seterror(err.message);
    },
  });

  useEffect(() => {
    generateIdRef.current = generateId;
  }, [generateId]);

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
    if (!getConversation) return;
    if (getConversation.data?.messages) {
      // eslint-disable-next-line
      setMessages(getConversation.data.messages as any);
    }
    // eslint-disable-next-line
  }, [params?.id, getConversation?.data?.messages]);

  if (params?.id && getConversation?.isPending) {
    return <ChatboxLoading />;
  }

  return (
    <div
      className={`flex flex-col gap-4`}
    >
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
                      case "tool-CreatePostAgent":
                        switch (part.state) {
                          case "input-available":
                            return <div key={i}>Loading weather...</div>;
                          case "output-available":
                            const outputs = part.output as AIToolsPostsOutput[];
                            return (
                              <AnimatePresence key={i}>
                                <motion.div
                                  className={`grid gap-2 w-full ${
                                    Show ? "grid-cols-1" : "grid-cols-2"
                                  }`}
                                >
                                  {outputs.map((output, index) => (
                                    <motion.div
                                      key={index}
                                    >
                                      <PostAffiliate
                                        images={output.images}
                                        title={output.title}
                                        content={output.content}
                                        category={output.category}
                                        tags={[""]}
                                        provider={output.provider}
                                      />
                                    </motion.div>
                                  ))}
                                </motion.div>
                              </AnimatePresence>
                            );
                          default:
                            return;
                        }
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
        <PromptInputBox
          setgenerateId={setGenerateId}
          generateId={generateId}
          sendMessage={sendMessage}
          status={status}
        />
      </div>
    </div>
  );
}

export default React.memo(ChatBox);
