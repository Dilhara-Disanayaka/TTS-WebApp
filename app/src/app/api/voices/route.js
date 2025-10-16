import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    
    let url = `${process.env.BACKEND_URL || 'http://localhost:8000'}/voices`
    if (user_id) {
      url += `?user_id=${user_id}`
    }
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch voices from backend')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching voices:', error)
    
    // Return fallback voices if backend is unavailable
    return NextResponse.json({
      voices: [
        { id: "dinithi", name: "Dinithi (Default)" },
        { id: "jerry", name: "Jerry" },
        { id: "obama", name: "Obama" }
      ]
    })
  }
}