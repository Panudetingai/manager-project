
export function sanitizeText(text: string) {
    return text.replace('<｜begin▁of▁sentence｜>', '')
}