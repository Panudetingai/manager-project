"use client";

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AIServiceTypeOption } from "@/modules/ai-service/ai.service";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { GlobeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/ai-service/chatStore";
import { ModelsType } from "../types/ai-service/ai-service-type";

const models: ModelsType[] = [
  {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    type: "anthropic",
    modelIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/2048px-Claude_AI_symbol.svg.png"
  },
  { id: "gemma-3-12b-it", name: "Gemini 1.5 Flash", type: "gemini", modelIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW26_bYY4S2PRKRtkug3XVKDIHhpwXhp_oYQ&s" },
  {
    id: "deepseek/deepseek-chat-v3.1:free",
    name: "DeepSeek V3.1",
    type: "openrouter",
    modelIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/DeepSeek-icon.svg/2048px-DeepSeek-icon.svg.png"
  },
  {
    id: "groq/compound",
    name: "Compound",
    type: "groq",
    modelIcon: "https://images.seeklogo.com/logo-png/60/2/groq-icon-logo-png_seeklogo-605779.png"
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    type: "groq",
    modelIcon: "https://images.seeklogo.com/logo-png/60/2/groq-icon-logo-png_seeklogo-605779.png"
  },
  {
    id: "qwen/qwen3-32b",
    name: "Qwen3-32B",
    type: "groq",
    modelIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Qwen_logo.svg/2048px-Qwen_logo.svg.png"
  }
];


const PromptInputBox = () => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<ModelsType["id"]>("gemma-3-12b-it");
  const [modelType, setModelType] = useState<ModelsType["type"]>(
    "gemini"
  );

  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const { setMessage, setStatus } = useChatStore();
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai-service/chat",
      body: {
        generatetype: useWebSearch ? "search" : "chat",
        typeai: modelType,
        options: {
          model: model,
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      } as AIServiceTypeOption,
    }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    // If currently streaming or submitted, stop instead of submitting
    if (status === "streaming" || status === "submitted") {
      stop();
      return;
    }

    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          typeai: modelType,
          options: {
            maxOutputTokens: 1000,
            temperature: 0.7,
            model: model,
          },
          // webSearch: useWebSearch,
        } as AIServiceTypeOption,
      }
    )

    setText("");
  };

  useEffect(() => {
    setMessage(messages);
    setStatus(status)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, status]);

  useEffect(() => {
    const selectedModel = models.find((m) => m.id === model);
    if (selectedModel) {
      setModelType(selectedModel.type);
    }
  }, [model]);

  return (
    <div className="flex flex-col justify-end size-full">
      <PromptInput globalDrop multiple onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputTextarea
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputSpeechButton onTranscriptionChange={setText} />
            <PromptInputButton
              onClick={() => setUseWebSearch(!useWebSearch)}
              variant={useWebSearch ? "default" : "ghost"}
            >
              <GlobeIcon size={16} />
              <span>Search</span>
            </PromptInputButton>
            <PromptInputModelSelect
              defaultValue={models[0].id}
              value={model}
              onValueChange={(value) => {
                const selectedModel = models.find(
                  (modelOption) => modelOption.id === value
                );
                if (selectedModel) {
                  setModel(() => {
                    setModelType(selectedModel.type);
                    return selectedModel.id;
                  });
                }
              }}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((modelOption) => (
                  <PromptInputModelSelectItem
                    key={modelOption.id}
                    value={modelOption.id}
                  >
                    <Avatar className="w-4 h-4">
                      <AvatarImage src={modelOption.modelIcon} alt={modelOption.name} />
                    </Avatar>
                    {modelOption.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit className="!h-8 rounded-full" status={status} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};

export default PromptInputBox;
