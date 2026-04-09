import { NextResponse } from 'next/server';
import entregasData from '@/data/entregas.json';

// Reutiliza o banco de dados de entregas (já classificados por IA) para a seção de notícias
// As notícias em destaque vêm de artigos reais da Agência Brasília entre 2023-2026
export async function GET() {
    // Ordena por data mais recente
    const sorted = [...entregasData].sort((a, b) => {
        const [da, ma, ya] = a.date.split('/').map(Number);
        const [db, mb, yb] = b.date.split('/').map(Number);
        return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
    });

    // Entrega os mais recentes como "noticias" com tag já definida pelo agente de IA
    return NextResponse.json({ noticias: sorted });
}
