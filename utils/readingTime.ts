export function calculateReadingTime(text: string): number {
    const cleanText = text.replace(/<[^>]*>/g, '')
    const words = cleanText.trim().split(/\s+/).length
    return Math.ceil(words / 200)
}
