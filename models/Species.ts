export interface Species {
    id: string;

    // Identidad básica
    commonName: string;           // Ej: "Ficus Lyrata"
    scientificName: string;       // Ej: "Ficus lyrata"
    family?: string;              // Ej: "Moraceae"

    // Información botánica
    origin?: string;              // Ej: "África occidental"
    description?: string;         // Texto descriptivo
    careLevel?: 'easy' | 'medium' | 'hard';
    sunlight?: 'low' | 'medium' | 'high';
    watering?: 'low' | 'medium' | 'high';

    // Imágenes de referencia
    image?: string;
    images?: string[];

    // Metadata opcional
    toxicity?: 'none' | 'pets' | 'humans' | 'both';
    growthRate?: 'slow' | 'medium' | 'fast';
    maxHeightCm?: number;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}
