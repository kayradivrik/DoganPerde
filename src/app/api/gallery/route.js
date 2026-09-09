import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET() {
  try {
    const galleryItems = await client.fetch('*[_type == "galleryItem"] | order(_createdAt desc)');
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Fetch gallery items from Sanity error:', error);
    return NextResponse.json([]);
  }
}
