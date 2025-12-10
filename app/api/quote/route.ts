import { NextResponse } from 'next/server'

// Fallback motivational quotes if API fails
const fallbackQuotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Life is what happens to you while you're busy making other plans. - John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Don't let yesterday take up too much of today. - Will Rogers",
  "You learn more from failure than from success. - Unknown",
  "If you are working on something exciting that you really care about, you don't have to be pushed. The vision pulls you. - Steve Jobs",
  "People who are crazy enough to think they can change the world, are the ones who do. - Rob Siltanen",
]

export async function GET() {
  try {
    // Try to fetch from a free quote API
    const response = await fetch('https://api.quotable.io/random?tags=motivational', {
      next: { revalidate: 0 }, // Always fetch fresh quotes
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ 
        quote: data.content,
        author: data.author,
        text: `${data.content} - ${data.author}`,
        keywords: data.content
      })
    }
  } catch (error) {
    console.error('Error fetching quote:', error)
  }

  // Fallback to random quote from our list
  const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
  const quoteText = randomQuote.split(' - ')[0]
  return NextResponse.json({ 
    quote: quoteText,
    author: randomQuote.split(' - ')[1] || 'Unknown',
    text: randomQuote,
    keywords: quoteText
  })
}

