import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET() {
  try {
    const categories = await client.fetch('*[_type == "category"] | order(_createdAt asc)');
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Fetch categories from Sanity error:', error);
    return NextResponse.json([]);
  }
}
