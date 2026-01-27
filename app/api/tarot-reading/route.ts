import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists first
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured', 
          details: 'OPENAI_API_KEY environment variable is missing or empty',
          keyPresent: false 
        },
        { status: 500 }
      )
    }

    // Dynamically import OpenAI to catch any import errors
    let OpenAI
    try {
      OpenAI = (await import('openai')).default
    } catch (importError: any) {
      return NextResponse.json(
        { 
          error: 'Failed to load OpenAI library', 
          details: importError.message 
        },
        { status: 500 }
      )
    }

    // Initialize OpenAI client
    let openai
    try {
      openai = new OpenAI({ apiKey })
    } catch (initError: any) {
      return NextResponse.json(
        { 
          error: 'Failed to initialize OpenAI client', 
          details: initError.message 
        },
        { status: 500 }
      )
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError: any) {
      return NextResponse.json(
        { 
          error: 'Failed to parse request body', 
          details: parseError.message 
        },
        { status: 400 }
      )
    }

    const { card, question, userInterpretation, conversationHistory, position, isReversed, allCards, locale } = body
    
    // Language mapping for AI responses
    const languageNames: Record<string, string> = {
      en: 'English',
      nl: 'Dutch',
      de: 'German',
      es: 'Spanish',
      fr: 'French',
    }
    const responseLang = languageNames[locale] || 'English'
    
    // Build the conversation messages
    const messages: any[] = [
      {
        role: "system",
        content: `You are an experienced, warm, and insightful tarot card reader. You provide thoughtful interpretations that help people reflect on their lives. You understand traditional tarot meanings but also connect them to the querent's personal journey. Be authentic, compassionate, and genuine. Keep responses concise but meaningful (2-3 paragraphs). IMPORTANT: You MUST respond entirely in ${responseLang}.`
      }
    ]

    // Add conversation history if it exists
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory)
    }

    // Build the prompt based on what we're reading
    let userPrompt = `The querent has asked: "${question}"\n\n`
    
    if (card) {
      // Single card reading
      const orientation = isReversed ? 'Reversed' : 'Upright'
      const meaning = isReversed ? card.reversed : card.upright
      
      userPrompt += `They have drawn the ${card.name} card in the ${position} position, appearing ${orientation}.\n`
      userPrompt += `Traditional meaning: ${meaning}\n\n`
      
      if (userInterpretation) {
        userPrompt += `The querent shared their initial impression: "${userInterpretation}"\n\n`
      }
      
      userPrompt += `Please provide an interpretation of this card in the ${position} position as it relates to their question.`
      
      if (conversationHistory && conversationHistory.length > 0) {
        userPrompt += ` Consider how this ${position} card connects with the cards already revealed.`
      }
    } else if (allCards) {
      // Combined reading for all three cards
      userPrompt += `The complete three-card spread has been revealed:\n\n`
      
      allCards.forEach((c: any) => {
        const orientation = c.isReversed ? 'Reversed' : 'Upright'
        userPrompt += `${c.position}: ${c.card.name} (${orientation})\n`
      })
      
      userPrompt += `\nPlease provide a combined interpretation that weaves together the Past, Present, and Future cards into a cohesive narrative that addresses their question. Show how the cards flow together and what story they tell.`
    }

    messages.push({
      role: "user",
      content: userPrompt
    })

    // Call OpenAI API
    let completion
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      })
    } catch (apiError: any) {
      console.error('OpenAI API call error:', apiError)
      
      // Provide helpful error messages based on error type
      let errorMessage = 'Failed to generate interpretation.'
      if (apiError.code === 'invalid_api_key') {
        errorMessage = 'OpenAI API key is invalid.'
      } else if (apiError.code === 'insufficient_quota') {
        errorMessage = 'OpenAI account needs billing setup. Please add a payment method at platform.openai.com/account/billing'
      } else if (apiError.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
      }
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          details: apiError.message,
          code: apiError.code,
          status: apiError.status,
          keyPresent: true,
          keyPreview: `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`
        },
        { status: 500 }
      )
    }

    const interpretation = completion.choices[0]?.message?.content || "I'm having trouble connecting with the cards right now. Please try again."

    // Return the interpretation and updated conversation history
    const updatedHistory = [
      ...messages.slice(1), // Skip the system message
      {
        role: "assistant",
        content: interpretation
      }
    ]

    return NextResponse.json({ 
      interpretation,
      conversationHistory: updatedHistory
    })
  } catch (error: any) {
    // Catch-all for any unexpected errors
    console.error('Unexpected error in tarot-reading API:', error)
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
