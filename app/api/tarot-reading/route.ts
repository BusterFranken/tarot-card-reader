import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Lazy initialization of OpenAI client
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  const openai = getOpenAIClient()
  try {
    const { card, question, userInterpretation, conversationHistory, position, isReversed, allCards } = await request.json()
    
    // Build the conversation messages
    const messages: any[] = [
      {
        role: "system",
        content: `You are an experienced, warm, and insightful tarot card reader. You provide thoughtful interpretations that help people reflect on their lives. You understand traditional tarot meanings but also connect them to the querent's personal journey. Be authentic, compassionate, and genuine. Keep responses concise but meaningful (2-3 paragraphs).`
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    })

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
    console.error('OpenAI API error:', error)
    
    // Provide helpful error messages
    let errorMessage = 'Failed to generate interpretation.'
    if (error.code === 'invalid_api_key') {
      errorMessage = 'OpenAI API key is missing or invalid. Please check your environment variables.'
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI account needs billing setup. Please add a payment method at platform.openai.com/account/billing'
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    )
  }
}
