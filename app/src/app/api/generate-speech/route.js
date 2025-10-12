import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    console.log("Received request to /api/generate-speech")
    const body = await request.json()
    const { text, user_id } = body

    console.log("User ID:", user_id)
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Call the FastAPI backend
    const response = await fetch('http://127.0.0.1:8000/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text:text, user_id:user_id })
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