import { NextRequest, NextResponse } from 'next/server'

// Extract keywords from quote text for image generation
function extractKeywords(text: string): string {
  // Common motivational keywords mapped to image search terms
  const keywordMap: { [key: string]: string } = {
    'success': 'success achievement',
    'achievement': 'achievement success',
    'dream': 'dreams stars night',
    'inspiration': 'inspiration motivation',
    'motivation': 'motivation inspiration',
    'growth': 'growth nature plant',
    'progress': 'progress journey path',
    'future': 'future horizon sunrise',
    'hope': 'hope light sunrise',
    'light': 'light sunrise dawn',
    'journey': 'journey path road',
    'mountain': 'mountain peak summit',
    'sunset': 'sunset horizon',
    'sunrise': 'sunrise dawn morning',
    'nature': 'nature landscape',
    'ocean': 'ocean waves beach',
    'sky': 'sky clouds blue',
    'stars': 'stars night sky',
    'pathway': 'pathway road journey',
    'horizon': 'horizon sunset',
    'adventure': 'adventure mountain',
    'freedom': 'freedom sky bird',
    'peace': 'peace nature calm',
    'work': 'work office success',
    'love': 'love heart connection',
    'change': 'change transformation',
    'world': 'world globe earth',
    'vision': 'vision future horizon',
    'dark': 'night stars moon',
    'doing': 'action movement',
    'yesterday': 'past memory',
    'failure': 'resilience strength',
    'exciting': 'excitement energy',
    'crazy': 'innovation creativity'
  }
  
  const lowerText = text.toLowerCase()
  
  // Find matching keywords in order of priority
  for (const [key, value] of Object.entries(keywordMap)) {
    if (lowerText.includes(key)) {
      return value
    }
  }
  
  // Extract meaningful words (4+ characters, not common words)
  const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']
  const words = text.split(/\s+/)
    .filter(word => word.length > 4)
    .map(word => word.toLowerCase().replace(/[^a-z]/g, ''))
    .filter(word => !commonWords.includes(word))
  
  if (words.length > 0) {
    return words[0] + ' inspirational'
  }
  
  return 'inspiration motivation'
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const quote = searchParams.get('quote') || 'inspiration motivation success'
  
  const keyword = extractKeywords(quote)
  const randomSeed = Math.floor(Math.random() * 1000000)
  const searchTerm = keyword.split(' ')[0] // Use first keyword
  
  // Try Unsplash Source API first (keyword-based images)
  // Format: https://source.unsplash.com/WIDTHxHEIGHT/?KEYWORD
  const unsplashUrl = `https://source.unsplash.com/1920x1080/?${searchTerm}`
  
  // Fallback to Picsum Photos (reliable but not keyword-matched)
  const picsumUrl = `https://picsum.photos/1920/1080?random=${randomSeed}`
  
  // Use Unsplash for keyword matching, but have Picsum as backup
  // Note: Unsplash Source API may have rate limits or CORS issues
  // For production, consider using Unsplash API with an access key
  const imageUrl = unsplashUrl
  
  return NextResponse.json({ 
    imageUrl,
    keyword: searchTerm,
    fallbackUrl: picsumUrl // Include fallback in response
  })
}

