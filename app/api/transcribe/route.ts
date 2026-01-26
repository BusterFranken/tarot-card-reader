import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          details: 'OPENAI_API_KEY environment variable is missing'
        },
        { status: 500 }
      )
    }

    // Get the form data with the audio file
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (err) {
      return NextResponse.json(
        { error: 'Failed to parse form data' },
        { status: 400 }
      )
    }

    const audioFile = formData.get('audio') as File | null
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Log audio file details for debugging
    console.log('Audio file received:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    })

    // Check file size (Whisper has a 25MB limit)
    const MAX_SIZE = 25 * 1024 * 1024 // 25MB
    if (audioFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 25MB.' },
        { status: 400 }
      )
    }

    // Check for minimum file size (very small files = likely empty/silent)
    if (audioFile.size < 1000) {
      console.log('Audio file too small, likely empty:', audioFile.size)
      return NextResponse.json(
        { error: 'Recording too short or empty. Please try again.' },
        { status: 400 }
      )
    }

    // Determine file extension from MIME type
    const mimeToExt: Record<string, string> = {
      'audio/webm': 'webm',
      'audio/webm;codecs=opus': 'webm',
      'audio/mp4': 'm4a',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
    }
    const extension = mimeToExt[audioFile.type] || 'webm'
    const filename = `audio.${extension}`

    // Prepare the request to OpenAI Whisper API
    const whisperFormData = new FormData()
    whisperFormData.append('file', audioFile, filename)
    whisperFormData.append('model', 'whisper-1')
    // Remove language parameter to allow auto-detection (supports more accents)
    whisperFormData.append('response_format', 'json')

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: whisperFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Whisper API error:', errorData)
      
      let errorMessage = 'Transcription failed'
      if (response.status === 401) {
        errorMessage = 'Invalid API key'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.'
      } else if (response.status === 400) {
        errorMessage = errorData.error?.message || 'Invalid audio format'
      }
      
      return NextResponse.json(
        { error: errorMessage, details: errorData.error?.message },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      text: data.text?.trim() || '',
    })
    
  } catch (error: any) {
    console.error('Transcribe API error:', error)
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error.message
      },
      { status: 500 }
    )
  }
}
