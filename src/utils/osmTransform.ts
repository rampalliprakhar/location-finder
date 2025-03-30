import { Location } from '@/types';

interface OsmElement {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    opening_hours?: string;
    [key: string]: string | undefined;
  };
}

export function transformOsmData(osmData: { elements: OsmElement[] }): Location[] {
  if (!osmData || !osmData.elements) {
    return [];
  }

  return osmData.elements
    .filter(element => element && element.lat && element.lon)
    .map(element => ({
      id: element.id,
      name: element.tags?.name || 'Unnamed Location',
      category: element.tags?.amenity || 'other',
      latitude: element.lat,
      longitude: element.lon,
      rating: Math.floor(Math.random() * 5) + 1,
      current_capacity: Math.floor(Math.random() * 100),
      total_capacity: 100,
      price_range: Math.floor(Math.random() * 4) + 1,
      operating_hours: element.tags?.opening_hours || '24/7',
      features: element.tags ? Object.keys(element.tags) : [],
      images: []
    }));
}
