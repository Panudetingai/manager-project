"use client";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageAvatar, MessageContent } from '@/components/ai-elements/message';
import { Response } from "@/components/ai-elements/response";
import { useAccountClient } from "@/lib/supabase/getUser-client";
import { UIMessage } from "ai";
import { useState } from "react";
import PromptInputBox from "./(chat-ai)/prompt-input";

export default function Chatbox() {
  const user = useAccountClient();
  const [messages, setMessages] = useState<UIMessage[]>([]);

  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex-1">
        <h1 className="font-semibold text-xl">Welcome to ChatServiceAI</h1>
        <p className="text-muted-foreground">
          Start a conversation with our AI-powered chat service.
        </p>
      </div>
      <div className="relative flex size-full flex-col divide-y overflow-hidden h-[600px]">
        <div className="flex flex-col h-full w-full">
          <Conversation>
            <ConversationContent>
              {messages.map(({...message }) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text": // we don't use any reasoning or tool calls in this example
                          return (
                            <Response isAnimating key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                  <MessageAvatar src={user.data?.avatar_url || ""} name={user.data?.username || ""} />
                </Message>
              ))}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1 sticky bottom-0 w-full mb-2">
            <PromptInputBox setMessageStream={setMessages} />
      </div>
    </div>
  );
}
