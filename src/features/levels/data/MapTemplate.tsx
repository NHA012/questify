import { levelImage } from '@/assets/images';

export interface DotPosition {
  x: number;
  y: number;
}

export interface MapTemplate {
  id: string;
  name: string;
  backgroundSrc: string;
  dotPositions: DotPosition[];
}

export const mapTemplates: MapTemplate[] = [
  {
    id: 'map-desert-001',
    name: 'Desert Map',
    backgroundSrc: levelImage.desertBackground,
    dotPositions: [
      { x: 3.5, y: 72 },
      { x: 5, y: 58 },
      { x: 4.4, y: 45 },
      { x: 13, y: 38 },
      { x: 20, y: 40 },
      { x: 25.8, y: 48 },
      { x: 24.7, y: 60 },
      { x: 25.5, y: 69 },
      { x: 30, y: 76 },
      { x: 37, y: 77.8 },
      { x: 43, y: 77 },
      { x: 48, y: 75 },
      { x: 53, y: 71 },
      { x: 57.3, y: 66.7 },
      { x: 60.5, y: 62.3 },
      { x: 63, y: 58 },
      { x: 65.5, y: 53.7 },
      { x: 67.5, y: 49.3 },
      { x: 69, y: 45 },
      { x: 69.7, y: 38.7 },
      { x: 69.5, y: 31.6 },
      { x: 68.6, y: 25 },
      { x: 68.3, y: 18.7 },
      { x: 68.2, y: 11.6 },
      { x: 68.5, y: 5 },
    ],
  },
  {
    id: 'map-mountain-002',
    name: 'Mountain Map',
    backgroundSrc: levelImage.mountainBackground,
    dotPositions: [
      { x: 19, y: 12 },
      { x: 23.5, y: 17.8 },
      { x: 29.5, y: 20.3 },
      { x: 36, y: 21 },
      { x: 42, y: 20 },
      { x: 49, y: 20.5 },
      { x: 51.6, y: 27 },
      { x: 50, y: 33.5 },
      { x: 45, y: 38 },
      { x: 39, y: 39.7 },
      { x: 33, y: 40 },
      { x: 27.3, y: 40 },
      { x: 22, y: 40.5 },
      { x: 17, y: 44.5 },
      { x: 22, y: 58 },
      { x: 22.5, y: 65.3 },
      { x: 26, y: 72.3 },
      { x: 32, y: 75.4 },
      { x: 38, y: 78 },
      { x: 44, y: 80.5 },
      { x: 49.5, y: 86 },
      { x: 55, y: 90.5 },
      { x: 61, y: 91.5 },
      { x: 67, y: 92 },
      { x: 73, y: 94.5 },
    ],
  },
  {
    id: 'map-forest-003',
    name: 'Forest Map',
    backgroundSrc: levelImage.forestBackground,
    dotPositions: [
      { x: 12.5, y: 36.5 },
      { x: 5.7, y: 19 },
      { x: 13.5, y: 10.7 },
      { x: 27.5, y: 11 },
      { x: 38.5, y: 11.5 },
      { x: 41.5, y: 22.5 },
      { x: 38.5, y: 32.5 },
      { x: 30, y: 40 },
      { x: 23, y: 49 },
      { x: 23.5, y: 64.5 },
      { x: 37.5, y: 69 },
      { x: 47, y: 67 },
      { x: 55, y: 64 },
      { x: 61, y: 52 },
      { x: 65, y: 40 },
      { x: 63.2, y: 25 },
      { x: 67, y: 16 },
      { x: 72.3, y: 7 },
      { x: 79, y: 11.3 },
      { x: 87, y: 10 },
      { x: 89, y: 24 },
      { x: 83.7, y: 36.7 },
      { x: 89, y: 50 },
      { x: 91, y: 64.5 },
      { x: 93.5, y: 78.5 },
    ],
  },
];
