'use client'

import { useState, useEffect } from 'react'

interface Quote {
  quote: string
  author: string
  text: string
  keywords?: string
}

interface ImageData {
  imageUrl: string
  fallbackUrl?: string
  keyword?: string
}

export default function Home() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string>('')
  const [fallbackImage, setFallbackImage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)

  const fetchQuote = async () => {
    setLoading(true)
    setImageLoading(true)
    try {
      const response = await fetch('/api/quote')
      const data = await response.json()
      setQuote(data)
      
      // Fetch matching background image
      if (data.quote) {
        const imageResponse = await fetch(`/api/image?quote=${encodeURIComponent(data.quote)}`)
        const imageData: ImageData = await imageResponse.json()
        setBackgroundImage(imageData.imageUrl)
        if (imageData.fallbackUrl) {
          setFallbackImage(imageData.fallbackUrl)
        }
      } else {
        setImageLoading(false)
      }
    } catch (error) {
      console.error('Error fetching quote:', error)
      setImageLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
      {/* Background Image */}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: imageLoading ? 0 : 1 }}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            console.warn('Background image failed to load, trying fallback')
            if (fallbackImage && backgroundImage !== fallbackImage) {
              setBackgroundImage(fallbackImage)
            } else {
              setImageLoading(false)
              setBackgroundImage('')
            }
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>
      )}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-white/20">
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-8">
            Motivational Quote Generator
          </h1>
          
          {loading ? (
            <div className="py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          ) : quote ? (
            <div className="py-8">
              <blockquote className="text-xl md:text-2xl font-light text-gray-800 mb-6 leading-relaxed">
                "{quote.quote}"
              </blockquote>
              <p className="text-sm md:text-base text-gray-600 italic">
                — {quote.author}
              </p>
            </div>
          ) : null}

          <button
            onClick={fetchQuote}
            disabled={loading}
            className="mt-8 px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm md:text-base shadow-lg hover:shadow-xl"
          >
            {loading ? 'Loading...' : 'New Quote'}
          </button>
        </div>
      </div>
      
      {/* Image loading indicator */}
      {imageLoading && backgroundImage && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </main>
  )
}

