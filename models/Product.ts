export interface Product {
    id: string;

    // Basic info
    image: string;
    images?: string[];
    name: string;
    scientificName: string;

    // Botanical metadata (1)
    careLevel?: 'easy' | 'medium' | 'hard';
    sunlight?: 'low' | 'medium' | 'high';
    watering?: 'low' | 'medium' | 'high';

    // Product condition (2)
    condition?: 'seedling' | 'young' | 'mature';
    size?: 'small' | 'medium' | 'large' | 'xl';
    isRare?: boolean;

    // Transaction details (3)
    type: 'sale' | 'trade' | 'free';
    price?: number;
    currency?: string;

    // Rating
    rating: number;
    reviews: number;

    // Availability (7)
    inStock: boolean;
    quantity?: number;

    // Timestamps (6)
    createdAt: string;
    updatedAt: string;
}
