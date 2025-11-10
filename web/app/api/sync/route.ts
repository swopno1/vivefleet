import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  console.log('Received data to sync:', data)
  return NextResponse.json({ message: 'Sync successful' })
}
