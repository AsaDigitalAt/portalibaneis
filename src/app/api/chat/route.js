import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'Você é um assistente virtual do Portal Ibaneis Rocha, desenhado para ajudar os cidadãos a buscar dados sobre as obras e entregas do governo do DF. Responda de forma sucinta, direta e cordial.' },
        ...messages
      ]
    });

    return NextResponse.json({ message: response.choices[0].message });
  } catch (error) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { error: 'Falha ao processar solicitação na API.' },
      { status: 500 }
    );
  }
}
