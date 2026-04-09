import { NextResponse } from 'next/server';

// Revalidar resgate de vídeos pelo framework (O cache previne bater limite da Apify)
// 21600 segundos = 6 horas (uma medida excelente para esperar o cron trabalhar e salvar banco local)
export const revalidate = 21600; 

export async function GET() {
  try {
    const token = process.env.APIFY_API_TOKEN;
    const url = `https://api.apify.com/v2/acts/h7sDV53CddomktSi5/runs/last/dataset/items?token=${token}&status=SUCCEEDED`;
    
    const response = await fetch(url, { next: { revalidate: 21600 } });
    if (!response.ok) {
        throw new Error('Falha ao obter os dados da APIFY. Verifique Run.');
    }
    const data = await response.json();
    return NextResponse.json({ videos: data });
  } catch(error) {
    console.error("Erro buscando dados via Apify:", error);
    return NextResponse.json({ videos: [] }, { status: 500 });
  }
}
