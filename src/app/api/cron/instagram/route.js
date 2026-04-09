import { ApifyClient } from 'apify-client';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const input = {
      "addParentData": false,
      "directUrls": ["https://www.instagram.com/ibaneisoficial"],
      "resultsLimit": 10,
      "resultsType": "posts",
      "searchLimit": 1,
      "searchType": "user"
    };

    // Sem bloqueio, chamando direto do Vercel!
    const run = await client.actor("shu8hvrXbJbY3Eb9W").start(input);
    
    return NextResponse.json({ 
        success: true, 
        message: "Trigger do Instagram despachado.", 
        runId: run.id 
    });
  } catch(error) {
    console.error("Erro no cron de IG:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
