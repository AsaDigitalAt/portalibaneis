import { NextResponse } from 'next/server';

// Revalidar resgate a cada meia hora devido a eventuais atrasos, maximo 1h.
export const revalidate = 3600; 

export async function GET() {
  try {
    const token = process.env.APIFY_API_TOKEN;
    const url = `https://api.apify.com/v2/acts/shu8hvrXbJbY3Eb9W/runs/last/dataset/items?token=${token}&status=SUCCEEDED`;
    
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
        throw new Error('Falha HTTP');
    }
    const data = await response.json();
    return NextResponse.json({ posts: data });
  } catch(error) {
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
