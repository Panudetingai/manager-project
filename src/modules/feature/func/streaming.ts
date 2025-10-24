import { GenerateTextResult, ToolSet } from "ai";

export async function streamingTextFunc(
  result: GenerateTextResult<ToolSet, never>,
  onStream: (text: string) => void
): Promise<void> {
  if (!result?.steps) return;

  for (const step of result.steps) {
    for (const content of step.content) {
      if (content.type === "text" && content.text) {
        let streamedText = "";
        for (let i = 0; i < content.text.length; i++) {
          streamedText += content.text[i];
          onStream(streamedText); // ส่งข้อความที่ stream ไปอัปเดต UI
        }
      }
    }
  }
}
