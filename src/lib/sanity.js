import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hrhbxh34',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // set to false for real-time/frequent updates
  token: process.env.SANITY_API_WRITE_TOKEN, // write token if doing write operations from nextjs
});

const builder = createImageUrlBuilder(client);

export function urlFor(source) {
  if (!source) return '';
  return builder.image(source);
}
