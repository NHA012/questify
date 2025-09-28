export enum MapPathTemplate {
  Desert = 'desert',
  Mountain = 'mountain',
  Forest = 'forest',
}

export interface IslandData {
  id: string;
  name: string;
  description: string;
  mapPathTemplate: MapPathTemplate;
  mapTemplateId: string; // Reference to the actual map template with dots
}

export const islandsData: IslandData[] = [
  {
    id: 'island-001',
    name: 'Beginners Island',
    description: 'A small island perfect for beginners with 7 challenge levels.',
    mapPathTemplate: MapPathTemplate.Desert,
    mapTemplateId: 'map-desert-001',
  },
  {
    id: 'island-002',
    name: 'Intermediate Island',
    description: 'A moderate difficulty island with 13 challenging levels.',
    mapPathTemplate: MapPathTemplate.Mountain,
    mapTemplateId: 'map-mountain-002',
  },
  {
    id: 'island-003',
    name: 'Advanced Island',
    description: 'A large island with 25 challenging levels for experienced students.',
    mapPathTemplate: MapPathTemplate.Forest,
    mapTemplateId: 'map-forest-003',
  },
];

export function getIslandById(id: string): IslandData | undefined {
  return islandsData.find((island) => island.id === id);
}
