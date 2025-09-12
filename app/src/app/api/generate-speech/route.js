import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Call the FastAPI backend
    const response = await fetch('http://localhost:8000/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    })

    if (!response.ok) {
      throw new Error('Failed to generate speech')
    }

    const audioBuffer = await response.arrayBuffer()
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Error generating speech:', error)
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 })
  }
}