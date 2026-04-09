import { NextResponse } from 'next/server';
import entregasData from '@/data/entregas.json';

export async function GET() {
    return NextResponse.json({ entregas: entregasData });
}
