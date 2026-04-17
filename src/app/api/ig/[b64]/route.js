import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const b64 = params.b64;
    
    if (!b64) {
      return new NextResponse('Missing encoded url', { status: 400 });
    }

    // Decode base64
    const imageUrl = Buffer.from(b64, 'base64').toString('utf-8');

    // Fazer a requisição da imagem burlando o bloqueio de Referer (hotlink protection) do Instagram
    const response = await fetch(imageUrl, {
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
        // Cache configurado perfeitamente para essa rota estática única
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error proxying image via path base64:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
