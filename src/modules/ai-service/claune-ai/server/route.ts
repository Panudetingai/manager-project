import Elysia from "elysia";
import { useAIService, type AIServiceTypeOption } from "../../ai.service";

const AIServiceAPI = new Elysia()
    .post("/claune-ai/chat", async (req) => {
        const { typeai, options, messages } = req.body as AIServiceTypeOption;
        const response = useAIService({
            typeai: typeai,
            options: options,
            messages
        });

        if (!response) throw new Error("AI Service not found");

        console.log(JSON.stringify(options, null, 2))

        const generatedText = response.generateText({
            paramater: {
                option: options,
                messages: messages
            },
        });

        return generatedText;
    })

export default AIServiceAPI;