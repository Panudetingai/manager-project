import { OptionParameter } from "@/modules/feature/types/ai-service/ai-service-type";
import { groq } from "@ai-sdk/groq";
import { Tool } from "ai";
import { CreatePostAgent } from "../../tools/create-post-agent";

function Tools(paramaterModel: OptionParameter["option"]["model"]) {
    switch (paramaterModel) {
    case "openai/gpt-oss-120b":
        return {
            createPostAgent: CreatePostAgent,
            browser_search: groq.tools.browserSearch({}) as Tool<unknown, unknown>
        }
    case "groq/compound":
        return {}
    default:
        return {
            createPostAgent: CreatePostAgent,
        }
  }
}

export { Tools };

