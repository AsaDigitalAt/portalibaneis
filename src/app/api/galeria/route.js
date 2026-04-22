import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Usa a REST API pura do Firebase Storage para o bucket fornecido
        const bucket = 'base-arquivos.firebasestorage.app';
        const rawPrefix = 'SITE/FOTOS GALERIA/';
        const apiUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?prefix=${encodeURIComponent(rawPrefix)}`;

        const response = await fetch(apiUrl, { cache: 'no-store' });
        
        if (response.status === 403) {
            return NextResponse.json({ 
                error: true, 
                message: 'Acesso negado. Você precisa alterar as regras do Storage no Console do Firebase para permitir "list".' 
            }, { status: 403 });
        }

        if (!response.ok) {
            throw new Error(`Firebase retornou status ${response.status}`);
        }

        const data = await response.json();
        
        // Filtra para garantir que apenas itens válidos (fotos) sejam retornados
        const validItems = data.items ? data.items.filter(item => {
            const ext = item.name.toLowerCase();
            return ext.endsWith('.jpg') || ext.endsWith('.png') || ext.endsWith('.jpeg') || ext.endsWith('.webp');
        }) : [];

        // Constrói URLs públicas completas com token proxy (alt=media)
        const fotos = validItems.map(item => {
            return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(item.name)}?alt=media`;
        });

        return NextResponse.json({ fotos });
    } catch(err) {
        console.error("Erro na API da Galeria:", err);
        return NextResponse.json({ error: true, message: err.message }, { status: 500 });
    }
}
