import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import type { ImagePickerAsset } from 'expo-image-picker';

export type Garment = { id: string };
export type PhotoDraft = { id: string; asset: ImagePickerAsset };

function itemsUrl(categoryId: string) {
  return new URL(
    '/categories/' + encodeURIComponent(categoryId) + '/items',
    process.env.EXPO_PUBLIC_API_URL,
  ).href;
}

export function photoUrl(id: string) {
  return new URL('/items/' + encodeURIComponent(id) + '/photo', process.env.EXPO_PUBLIC_API_URL)
    .href;
}

export async function fetchItems(categoryId: string, signal: AbortSignal): Promise<Garment[]> {
  const response = await fetch(itemsUrl(categoryId), { signal });
  if (!response.ok) {
    throw new Error('Couldn’t load clothing.');
  }
  return response.json();
}

export async function saveItem(categoryId: string, draft: PhotoDraft): Promise<Garment> {
  const response = await expoFetch(itemsUrl(categoryId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream', 'Idempotency-Key': draft.id },
    body: draft.asset.file ?? new File(draft.asset.uri),
  });
  if (response.status === 413) {
    throw new Error('Choose a photo smaller than 20 MB.');
  }
  if (response.status === 415) {
    throw new Error('This image format is unsupported. Try a JPEG or PNG.');
  }
  if (!response.ok) {
    throw new Error('Couldn’t save the photo. Please try again.');
  }
  return response.json();
}
