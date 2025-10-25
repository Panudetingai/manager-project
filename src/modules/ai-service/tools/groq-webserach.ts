import { tool, ToolSet } from "ai";
import { z } from "zod";

const QroqWebSearchTool = tool({
    name: "web_search",
    description: "Use this tool to search the web for relevant information.",
    inputSchema: z.object({
        query: z.string().describe("The search query string"),
        website: z.string().describe("Optional website to limit the search to"),
        content: z.string().describe("Optional content to search within the website"),
    })
})       

export const Groqtools = {
    WebSearch: QroqWebSearchTool,
} satisfies ToolSet;