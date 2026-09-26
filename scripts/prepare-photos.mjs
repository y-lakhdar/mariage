import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public/photos');
await mkdir(output, { recursive: true });

const photos = {
  garden: 'secretgarden_18.JPG',
  summit: 'IMG_0967.JPG',
  kiss: 'IMG_7507.jpeg',
  desert: 'IMG_2976.jpeg',
  snow: 'IMG_2640.jpeg',
  embrace: 'IMG_2404.jpeg',
  canoe: 'IMG_1075.jpeg',
  river: 'IMG_1444.jpeg',
  ride: 'IMG_1757.jpeg',
};

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
