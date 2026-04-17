import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    // Fazer a requisição da imagem burlando o bloqueio de Referer (hotlink protection) do Instagram
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
    }

    // Retorna a imagem como um array buffer
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        // Sendo um POST, a CDN não faz cache nativamente, apenas o browser pode tratar o blob localmente.
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error proxying image via POST:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
