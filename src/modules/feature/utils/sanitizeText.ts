export function sanitizeText(text: string) {
  if (!text) return "";

  return text
    .replace(/<\|begin▁of▁sentence\|>/gi, "")
    .replace(/<\|end▁of▁sentence\|>/gi, "")
    .replace(/<think\b[^>]*>[\s\S]*?<\/think>/gi, "")
    .replace(/<think\b[^>]*\/?>/gi, "")
    .replace(/<tool\b[^>]*>[\s\S]*?<\/tool>/gi, "")
    .replace(/<tool\b[^>]*\/?>/gi, "")
}

export function normalizeMarkdown(raw: string) {
  let text = raw.replace(/\\n/g, "\n").replace(/\\"/g, '"');

  // แปลง code block ให้ถูกต้อง
  text = text
    .replace(/\\`/g, "`")                   // unescape backticks
    .replace(/```(\w+)\s*\n+/g, "```$1\n")  // fix opening
    .replace(/\n+\s*```/g, "\n```");        // fix closing

  // ลบบรรทัดว่างเกิน
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

