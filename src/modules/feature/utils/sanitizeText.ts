export function sanitizeText(text: string) {
  return text
    .replace(/<\|begin▁of▁sentence\|>/g, "")
    .replace(/<think\b[^>]*>[\s\S]*?<\/think>/gi, "") // ลบทั้งแท็กและเนื้อหา
    .replace(/<think\b[^>]*\/?>/gi, ""); // ลบแท็กเดี่ยว <think> หรือ <think .../>
}