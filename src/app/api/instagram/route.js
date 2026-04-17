import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const token = process.env.APIFY_API_TOKEN;
    
    // 1. Cronjob Nativo do Next.js: Verificar quando foi a última varredura
    const runsUrl = `https://api.apify.com/v2/acts/shu8hvrXbJbY3Eb9W/runs?token=${token}&desc=true&limit=1`;
    const runsRes = await fetch(runsUrl);
    
    if (runsRes.ok) {
         const runsStatus = await runsRes.json();
         if (runsStatus?.data?.items?.length > 0) {
              const lastRun = runsStatus.data.items[0];
              const lastRunStart = new Date(lastRun.startedAt).getTime();
              const hrsSinceLastRun = (Date.now() - lastRunStart) / (1000 * 60 * 60);
              
              // Se a apify descansou mais de 6 horas, e não estiver varrendo agora mesmo
              if (hrsSinceLastRun > 6 && lastRun.status !== 'RUNNING' && lastRun.status !== 'READY') {
                  console.log('⏳ CRON Automático: +6h de defasagem detectadas. Acionando Apify Instagram Scraper em background...');
                  
                  // Dá o Start assíncrono no Scraper do Instagram do Ibaneis para o próximo visitante ver tudo novo!
                  fetch(`https://api.apify.com/v2/acts/shu8hvrXbJbY3Eb9W/runs?token=${token}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          "addParentData": false,
                          "directUrls": ["https://www.instagram.com/ibaneisoficial/"],
                          "resultsLimit": 10,
                          "resultsType": "posts"
                      })
                  }).catch(e => console.error('Apify Start Actor falhou silenciosamente', e));
              }
         }
    }

    // 2. Retornar instantaneamente a memória do último Scraper bem-sucedido para não travar a UI
    const url = `https://api.apify.com/v2/acts/shu8hvrXbJbY3Eb9W/runs/last/dataset/items?token=${token}&status=SUCCEEDED`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    
    if (!response.ok) {
        throw new Error('Falha HTTP');
    }
    const data = await response.json();
    return NextResponse.json({ posts: data });
    
  } catch(error) {
    console.error('IG Apify falhou:', error);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
