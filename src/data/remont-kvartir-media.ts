import type { ImageMetadata } from 'astro';

const gostinayaFiles = import.meta.glob<ImageMetadata>(
  '../../docs/content/media/remont-kvartir/cases/gostinaya/*',
  { eager: true, import: 'default' },
);
const kuhnyaFiles = import.meta.glob<ImageMetadata>(
  '../../docs/content/media/remont-kvartir/cases/kuhnya/*',
  { eager: true, import: 'default' },
);
const sanuzelFiles = import.meta.glob<ImageMetadata>(
  '../../docs/content/media/remont-kvartir/cases/sanuzel/*',
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

const rooms: CaseGroup[] = [
  { title: 'Гостиная', photos: photos(gostinayaFiles, 'Гостиная после ремонта') },
  { title: 'Кухня', photos: photos(kuhnyaFiles, 'Кухня после ремонта') },
  { title: 'Санузел', photos: photos(sanuzelFiles, 'Санузел после ремонта') },
];

export const caseGroups: CaseGroup[] = rooms.filter((group) => group.photos.length > 0);
