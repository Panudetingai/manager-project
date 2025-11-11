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
