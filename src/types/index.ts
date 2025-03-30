export interface Location {
    id: number;
    name: string;
    category: string;
    latitude: number;
    longitude: number;
    rating: number;
    current_capacity: number;
    total_capacity: number;
    price_range: number;
    operating_hours: string;
    features: string[];
    images: string[];
}