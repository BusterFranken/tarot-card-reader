import { NextRequest, NextResponse } from 'next/server'

// Mock responses for demo mode (no OpenAI costs!)
const mockResponses = {
  past: [
    "This card in your past reveals a foundation of potential and new beginnings. The energy here suggests you've been through a period of learning and growth, where you were building skills and discovering your capabilities. There's a sense that you were laying groundwork, perhaps without realizing how important these early steps would become. This past influence has given you practical tools and a grounded perspective that continues to serve you today.",
    "Looking at your past position, there's a strong energy of transformation and change. You've come through a significant period where old patterns were breaking down to make way for something new. This wasn't necessarily easy, but it was necessary. The experiences from this time have taught you resilience and the ability to let go of what no longer serves you. This past chapter has shaped your current strength.",
    "The past card shows a time of introspection and inner work. You were on a journey of self-discovery, perhaps pulling away from external noise to find your own truth. This period of solitude or reflection has given you wisdom and a deeper understanding of yourself. The lessons learned during this phase continue to guide your intuition and inner knowing today."
  ],
  present: [
    "In your present moment, this card indicates a time of active manifestation and forward movement. You're in a phase where you have the tools and the energy to make things happen. The universe is supporting your efforts, and there's a dynamic quality to this time - things are shifting and evolving. This is a powerful moment to trust your abilities and take confident action toward your goals.",
    "The present card reveals a period of balance and careful consideration. You're being called to weigh your options and find equilibrium in your life. This isn't a time for hasty decisions, but rather for thoughtful reflection on where you stand and where you want to go. There's wisdom in taking your time and ensuring you're aligned with your true values before moving forward.",
    "Right now, you're in a phase of emotional abundance and creative flow. The present card shows opportunities for connection, joy, and authentic expression. This is a time to open your heart, share your gifts, and embrace the richness of human experience. Trust the positive energy flowing through your life and allow yourself to fully engage with what brings you alive."
  ],
  future: [
    "Looking ahead, this card suggests a future filled with clarity and achievement. The path you're on is leading toward a goal or vision that lights you up. There's promise here of recognition, success, and the satisfaction of seeing your efforts come to fruition. Continue following your inner light, and you'll find yourself stepping into a brighter chapter where your authentic self can truly shine.",
    "The future position indicates a time of deeper wisdom and spiritual understanding ahead. You're moving toward a phase where life's bigger picture becomes clearer. This isn't just about external achievements, but about inner fulfillment and a sense of meaning. Trust that you're being guided toward experiences that will enrich your soul and expand your perspective on what truly matters.",
    "Your future card shows a period of new opportunities and fresh starts on the horizon. There's an energy of excitement and potential waiting for you. This could manifest as a new project, relationship, or direction in life that reignites your passion and sense of possibility. Stay open to unexpected opportunities and trust your instincts when doors begin to open."
  ],
  combined: [
    "Weaving these three cards together, your reading tells a story of evolution and purposeful growth. Your past experiences, even the challenging ones, have prepared you for where you are now. In your present moment, you're being called to apply what you've learned with confidence and intention. The future holds promise when you trust the journey - the foundations you've built and the work you're doing now are all leading somewhere meaningful. This is a reading about becoming, about stepping more fully into who you're meant to be. Trust the process, honor both where you've been and where you're going, and know that you have everything you need within you to navigate what lies ahead.",
    "Your three-card spread reveals a powerful narrative of transformation. The past has shaped you, teaching you resilience and self-knowledge. In the present, you're at a crossroads, being asked to make choices that align with your authentic self. The future beckons with new possibilities that will only fully manifest when you honor the lessons of the past while staying present to your current truth. This reading encourages you to see your life as an unfolding story where each chapter builds upon the last. You're not just moving through time - you're actively creating your path. The cards remind you that you have agency, wisdom, and the support of the universe as you navigate your journey.",
    "Looking at your complete reading, there's a beautiful arc of development here. Your past has given you gifts - tools, insights, and strengths that you may not fully appreciate yet. Your present is asking you to use these gifts consciously, to make choices from a place of self-awareness and intention. And your future? It's bright with potential, especially when you approach it with both the wisdom of experience and the openness of a beginner's mind. This reading is ultimately about integration - bringing together all the parts of your journey into a cohesive whole. You're being invited to see yourself as complete, worthy, and capable, right now, while also remaining open to continued growth and transformation."
  ]
}

function getRandomResponse(position: string): string {
  const responses = mockResponses[position as keyof typeof mockResponses] || mockResponses.present
  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { card, position, allCards, userInterpretation, conversationHistory } = await request.json()
    
    // Simulate API delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    let interpretation = ''
    
    if (allCards) {
      // Combined reading
      interpretation = getRandomResponse('combined')
    } else if (position) {
      // Individual card reading
      const positionKey = position.toLowerCase()
      interpretation = getRandomResponse(positionKey)
      
      // If user shared their interpretation, add a personalized touch
      if (userInterpretation) {
        interpretation = `I love how you noticed that - "${userInterpretation}." Your intuition is guiding you well. ${interpretation}`
      }
    }
    
    // Build conversation history
    const updatedHistory = [
      ...(conversationHistory || []),
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
    console.error('Demo API error:', error)
    return NextResponse.json(
      { error: 'Demo mode error', details: error.message },
      { status: 500 }
    )
  }
}
