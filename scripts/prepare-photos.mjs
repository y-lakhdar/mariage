import sharp from 'sharp';
import { mkdir, stat, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public/photos');
await mkdir(output, { recursive: true });

const photos = {
  'garden-coast': 'secretgarden.jpg',
  course: 'img_course.jpg',
  preuve: 'preuve.jpeg',
  amis: 'amis.jpeg',
  canot: 'image_canot.jpg',
  kiss: 'IMG_7507.jpeg',
  snow: 'IMG_2640.jpeg',
  embrace: 'IMG_2404.jpeg',
  climbing: 'img_climbing.JPG',
  end: 'img_end.JPG',
  mtl: 'img_mtl.jpg',
};

// Retire uniquement les variantes générées des photos remplacées.
for (const id of ['river', 'ride', 'canoe', 'desert', 'summit']) {
  for (const width of [640, 1200, 1800]) {
    await rm(resolve(output, `${id}-${width}.webp`), { force: true });
  }
}

for (const [id, file] of Object.entries(photos)) {
  const source = resolve(root, 'photos_mariage', file);
  for (const width of [640, 1200, 1800]) {
    const target = resolve(output, `${id}-${width}.webp`);
    const current = await stat(target).catch(() => null);
    if (current && current.mtimeMs > (await stat(source)).mtimeMs) continue;
    // Applique l’orientation EXIF et retire les métadonnées des photos publiées.
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
  }
}

await sharp(resolve(root, 'photos_mariage', photos.kiss))
  .rotate().resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 85 }).toFile(resolve(output, 'partage.jpg'));
console.log(`Photos prêtes : ${Object.keys(photos).length} images, 3 tailles adaptées aux écrans et un aperçu de partage.`);
