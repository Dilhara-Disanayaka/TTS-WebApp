import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Forward the form data to the FastAPI backend
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/upload-user-voice`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error uploading user voice:', error)
    return NextResponse.json(
      { error: 'Failed to upload voice' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    
    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/user-voices/${user_id}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch user voices')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching user voices:', error)
    return NextResponse.json({ voices: [] })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const voice_id = searchParams.get('voice_id')
    const user_id = searchParams.get('user_id')
    
    if (!voice_id || !user_id) {
      return NextResponse.json({ error: 'Voice ID and User ID are required' }, { status: 400 })
    }
    
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/user-voices/${voice_id}?user_id=${user_id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete voice')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error deleting user voice:', error)
    return NextResponse.json(
      { error: 'Failed to delete voice' },
      { status: 500 }
    )
  }
}