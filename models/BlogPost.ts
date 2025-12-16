export interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    content: ContentBlock[]
    coverImage?: string
    category: string
    tags: string[]
    author: {
        name: string
        thumbnail?: string
        image?: string
        description?: string
    }
    list: TOCItem[]

    publishedAt?: string | null

    readingTime?: number
    readTime?: string | number
    featured?: boolean
    status: "draft" | "published"
    related?: BlogPost[]
}

export interface TOCItem {
    id: string
    text: string
}

export interface ContentBlock {
    type: 'paragraph' | 'heading' | 'image' | 'list' | 'quote'
    data: any
}
