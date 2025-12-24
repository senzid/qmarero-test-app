import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {

    const filePath = join(process.cwd(), 'data', 'bill.json');
    const fileContents = await readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching bill data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bill data' },
      { status: 500 }
    );
  }
}

