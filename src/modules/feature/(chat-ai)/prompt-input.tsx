"use client";

import { ModelSelector, ModelSelectorContent, ModelSelectorEmpty, ModelSelectorGroup, ModelSelectorInput, ModelSelectorItem, ModelSelectorList, ModelSelectorLogo, ModelSelectorLogoGroup, ModelSelectorName, ModelSelectorTrigger } from "@/components/ai-elements/model-selector";
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
  PromptInputProvider,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { AIServiceTypeOption } from "@/modules/ai-service/ai.service";
import {
  ChatRequestOptions,
  ChatStatus,
  FileUIPart,
  UIDataTypes,
  UIMessage,
  UITools,
} from "ai";
import { CheckIcon, GlobeIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useChatControls } from "../store/ai-service/chatStore";
import { ModelsType } from "../types/ai-service/ai-service-type";

const models: ModelsType[] = [
  {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic"],
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    chef: "Google",
    chefSlug: "gemini",
    providers: ["gemini"],
    modelIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW26_bYY4S2PRKRtkug3XVKDIHhpwXhp_oYQ&s",
  },
  {
    id: "deepseek/deepseek-chat-v3.1:free",
    name: "DeepSeek V3.1",
    chef: "OpenRouter",
    chefSlug: "openrouter",
    providers: ["openrouter"],
  },
  {
    id: "groq/compound",
    name: "Compound",
    chef: "Groq",
    chefSlug: "groq",
    providers: ["groq"],
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    chef: "Groq",
    chefSlug: "groq",
    providers: ["groq"],
  },
  {
    id: "qwen/qwen3-32b",
    name: "Qwen3-32B",
    chef: "Groq",
    chefSlug: "groq",
    providers: ["groq"],
  },
  {
    id: "meta-llama/llama-4-maverick-17b-128e-instruct",
    name: "Llama 4 Maverick 17B",
    chef: "Groq",
    chefSlug: "groq",
    providers: ["groq"],
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    chef: "Groq",
    chefSlug: "groq",
    providers: ["groq"],
  },
];

interface PromptInputBoxProps {
  sendMessage: (
    message?:
      | (Omit<UIMessage<unknown, UIDataTypes, UITools>, "id" | "role"> & {
          id?: string | undefined;
          role?: "system" | "user" | "assistant" | undefined;
        } & {
          text?: never;
          files?: never;
          messageId?: string;
        })
      | {
          text: string;
          files?: FileList | FileUIPart[];
          metadata?: undefined;
          parts?: never;
          messageId?: string;
        }
      | {
          files: FileList | FileUIPart[];
          metadata?: undefined;
          parts?: never;
          messageId?: string;
        }
      | undefined,
    options?: ChatRequestOptions,
    chatId?: string
  ) => Promise<void>;
  status: ChatStatus;
  setgenerateId: (id: string) => void;
  generateId: string;
}

const PromptInputBox = ({
  sendMessage,
  status,
  setgenerateId,
  generateId,
}: PromptInputBoxProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [model, setModel] = useState<string>(models[0].id);
  const { setModal, modal, modalType, setModalType } = useChatControls();
  const {project} = useParams();
  const pathChat = crypto.randomUUID();
  const parameterChatId = generateId || (pathChat as string);
  const selectedModelData = models.find((m) => m.id === model);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);

  const handleSubmit = async (message: PromptInputMessage) => {
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

    setgenerateId(parameterChatId as string);

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          typeai: modalType,
          generatetype: "chat",
          options: {
            model: modal,
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        } as AIServiceTypeOption,
      }
    );

    window.history.pushState(
      {},
      "",
      `/dashboard/${project}/ai-chat/${parameterChatId}`
    );
  };

  useEffect(() => {
    const selectedModel = models.find((m) => m.id === model);
    if (selectedModel) {
      setModalType(selectedModel.chefSlug);
    }
    // eslint-disable-next-line
  }, [model]);

  return (
    <div className="size-full">
      <PromptInputProvider>
        <PromptInput globalDrop multiple onSubmit={handleSubmit}>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputBody>
            <PromptInputTextarea ref={textareaRef} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputSpeechButton textareaRef={textareaRef} />
              <PromptInputButton>
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <ModelSelector
                onOpenChange={setModelSelectorOpen}
                open={modelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <PromptInputButton>
                    {selectedModelData?.chefSlug && (
                      <ModelSelectorLogo
                        provider={selectedModelData.chefSlug}
                      />
                    )}
                    {selectedModelData?.name && (
                      <ModelSelectorName>
                        {selectedModelData.name}
                      </ModelSelectorName>
                    )}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {["Anthropic", "Google", "Groq", "OpenRouter"].map((chef) => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {models
                          .filter((m) => m.chef === chef)
                          .map((m) => (
                            <ModelSelectorItem
                              key={m.id}
                              onSelect={() => {
                                setModal(m.id);
                                setModel(m.id);
                                setModelSelectorOpen(false);
                              }}
                              value={m.id}
                            >
                              <ModelSelectorLogo provider={m.chefSlug} />
                              <ModelSelectorName>{m.name}</ModelSelectorName>
                              <ModelSelectorLogoGroup>
                                {m.providers.map((provider) => (
                                  <ModelSelectorLogo
                                    key={provider}
                                    provider={provider}
                                  />
                                ))}
                              </ModelSelectorLogoGroup>
                              {model === m.id ? (
                                <CheckIcon className="ml-auto size-4" />
                              ) : (
                                <div className="ml-auto size-4" />
                              )}
                            </ModelSelectorItem>
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
};

export default PromptInputBox;
