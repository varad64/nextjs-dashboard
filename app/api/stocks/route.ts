import { fetchStocksData } from '@/app/lib/stock-data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const data = await fetchStocksData();
  return NextResponse.json(data);
}
