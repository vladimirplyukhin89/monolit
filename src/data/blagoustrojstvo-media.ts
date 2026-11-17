import type { ImageMetadata } from 'astro';

import heroPhoto from '../../docs/content/media/blagoustrojstvo/hero/01.png';
import beforePhoto from '../../docs/content/media/blagoustrojstvo/before-after/01.jpeg';
import afterPhoto from '../../docs/content/media/blagoustrojstvo/before-after/02.jpeg';

const dorozhkiFiles = import.meta.glob<ImageMetadata>(
  '../../docs/content/media/blagoustrojstvo/cases/dorozhki/*',
  { eager: true, import: 'default' },
);
const asfaltFiles = import.meta.glob<ImageMetadata>(
  '../../docs/content/media/blagoustrojstvo/cases/asfalt/*',
  { eager: true, import: 'default' },
);
const ploshchadkiFiles = import.meta.glob<ImageMetadata>(
  '../../docs/content/media/blagoustrojstvo/cases/ploshchadki/*',
  { eager: true, import: 'default' },
);
const otmostkiFiles = import.meta.glob<ImageMetadata>(
  '../../docs/content/media/blagoustrojstvo/cases/otmostki/*',
  { eager: true, import: 'default' },
);
const reviewFiles = import.meta.glob<ImageMetadata>(
  '../../docs/content/media/blagoustrojstvo/reviews/*',
  { eager: true, import: 'default' },
);

export interface Photo {
  src: ImageMetadata;
  alt: string;
}

export interface CaseGroup {
  title: string;
  photos: Photo[];
}

function photos(files: Record<string, ImageMetadata>, alt: string): Photo[] {
  return Object.entries(files)
    .filter(([path]) => /\.(jpe?g|png|webp)$/i.test(path))
    .sort(([a], [b]) => a.localeCompare(b, 'en'))
    .map(([, src], index) => ({
      src,
      alt: `${alt}, фото ${index + 1}`,
    }));
}

export { heroPhoto, beforePhoto, afterPhoto };

export const caseGroups: CaseGroup[] = [
  { title: 'Дорожки', photos: photos(dorozhkiFiles, 'Дорожки') },
  { title: 'Асфальтирование', photos: photos(asfaltFiles, 'Асфальтирование') },
  { title: 'Площадки', photos: photos(ploshchadkiFiles, 'Площадки') },
  { title: 'Отмостки', photos: photos(otmostkiFiles, 'Отмостки') },
];

export const reviewShots: Photo[] = photos(reviewFiles, 'Скриншот отзыва');
