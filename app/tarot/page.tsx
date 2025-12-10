'use client'

import { useState } from 'react'
import Image from 'next/image'
import { allCards, TarotCard, getCombinationMeaning } from '../data/tarotCards'

interface SelectedCard {
  card: TarotCard
  isReversed: boolean
  position: string
}

type ReadingStep = 'question' | 'shuffling' | 'revealing' | 'complete'

export default function TarotPage() {
  const [step, setStep] = useState<ReadingStep>('question')
  const [question, setQuestion] = useState('')
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])
  const [revealedCardIndex, setRevealedCardIndex] = useState(-1)
  const [shufflingProgress, setShufflingProgress] = useState(0)
  const [combinationMeaning, setCombinationMeaning] = useState('')

  const startReading = () => {
    if (!question.trim()) {
      alert('Please enter your question or focus')
      return
    }
    setStep('shuffling')
    setShufflingProgress(0)
    
    // Simulate shuffling animation
    const interval = setInterval(() => {
      setShufflingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            selectCards()
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const selectCards = () => {
    // Shuffle entire deck (all 78 cards)
    const shuffled = [...allCards].sort(() => Math.random() - 0.5)
    
    // Select 3 cards for Past, Present, Future spread
    const positions = ['Past', 'Present', 'Future']
    const cards: SelectedCard[] = []
    
    for (let i = 0; i < 3; i++) {
      const card = shuffled[i]
      const isReversed = Math.random() > 0.5 // 50% chance of reversal
      cards.push({
        card,
        isReversed,
        position: positions[i],
      })
    }
    
    // Calculate combination meaning
    const comboMeaning = getCombinationMeaning(cards)
    setCombinationMeaning(comboMeaning)
    
    // Set cards and start revealing
    setSelectedCards(cards)
    setStep('revealing')
    setRevealedCardIndex(-1)
    
    // Reveal cards one by one with proper timing
    setTimeout(() => {
      setRevealedCardIndex(0) // Reveal first card
      setTimeout(() => {
        setRevealedCardIndex(1) // Reveal second card
        setTimeout(() => {
          setRevealedCardIndex(2) // Reveal third card
          setTimeout(() => {
            setStep('complete') // Move to complete step
          }, 2000)
        }, 2500)
      }, 2500)
    }, 1000)
  }

  const resetReading = () => {
    setStep('question')
    setQuestion('')
    setSelectedCards([])
    setRevealedCardIndex(-1)
    setShufflingProgress(0)
    setCombinationMeaning('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Mystical background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-light text-center text-gray-800 mb-2">
            Tarot Card Reading
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Three Card Spread: Past • Present • Future
          </p>

          {step === 'question' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-3 text-lg">
                  Focus your energy on a question or area of your life:
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What do you seek guidance on? (e.g., 'What do I need to know about my career path?')"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Take a moment to center yourself and focus on your question. The cards will respond to your energy.
                </p>
              </div>
              <button
                onClick={startReading}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
              >
                Begin Reading
              </button>
            </div>
          )}

          {step === 'shuffling' && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
              </div>
              <p className="text-xl text-gray-700 mb-4">Shuffling the deck...</p>
              <p className="text-gray-600 mb-6">Focus on your question as the cards align with your energy</p>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${shufflingProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {(step === 'revealing' || step === 'complete') && (
            <div className="space-y-8">
              {selectedCards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mb-4"></div>
                  <p className="text-gray-600">Preparing your cards...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedCards.map((selectedCard, index) => {
                      // Card is revealed if revealedCardIndex is >= its index (and >= 0)
                      const isRevealed = revealedCardIndex >= 0 && revealedCardIndex >= index
                      const isCurrent = revealedCardIndex === index
                      
                      return (
                        <div
                          key={index}
                          className={`relative transition-all duration-1000 ${
                            isRevealed ? 'opacity-100 scale-100' : 'opacity-100 scale-95'
                          }`}
                        >
                          <div
                            className={`bg-gradient-to-br ${
                              selectedCard.isReversed
                                ? 'from-red-50 to-orange-50 border-red-300'
                                : 'from-blue-50 to-purple-50 border-blue-300'
                            } border-2 rounded-xl p-4 shadow-lg flex flex-col items-center min-h-[500px] ${
                              isCurrent ? 'ring-4 ring-purple-400 ring-offset-2' : ''
                            }`}
                          >
                            {isRevealed ? (
                              <>
                                <div className="text-center mb-3 w-full">
                                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                                    selectedCard.isReversed
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {selectedCard.isReversed ? 'REVERSED' : 'UPRIGHT'}
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-800 mb-1">{selectedCard.card.name}</h3>
                                  <p className="text-xs font-medium text-gray-600">{selectedCard.position}</p>
                                </div>
                                
                                <div className="relative w-full aspect-[2/3] mb-4">
                                  <Image
                                    src={selectedCard.card.image}
                                    alt={selectedCard.card.name}
                                    fill
                                    className={`object-contain transition-all duration-500 ${selectedCard.isReversed ? 'rotate-180' : ''}`}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    unoptimized
                                    onError={(e) => {
                                      console.error('Image failed to load:', selectedCard.card.image)
                                    }}
                                  />
                                </div>
                                
                                <div className="text-xs text-gray-700 leading-relaxed w-full">
                                  <p className="font-medium mb-1">Meaning:</p>
                                  <p className={selectedCard.isReversed ? 'text-red-700' : 'text-blue-700'}>
                                    {selectedCard.isReversed ? selectedCard.card.reversed : selectedCard.card.upright}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-center h-full flex-col w-full">
                                <div className="relative w-full aspect-[2/3] mb-4">
                                  <Image
                                    src="/cards/CardBacks.png"
                                    alt="Card Back"
                                    fill
                                    className="object-contain animate-pulse"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    unoptimized
                                  />
                                </div>
                                <p className="text-sm text-gray-500 font-medium">{selectedCard.position}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {step === 'complete' && (
                    <div className="text-center space-y-6">
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Combined Reading</h3>
                        <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                          {combinationMeaning}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Question</h3>
                        <p className="text-gray-700 leading-relaxed mb-4 italic">
                          "{question}"
                        </p>
                        <p className="text-sm text-gray-600">
                          Reflect on how each card position relates to your question. The Past shows what has influenced you, the Present reveals your current situation, and the Future indicates potential outcomes. Trust your intuition as you interpret these cards.
                        </p>
                      </div>
                      
                      <button
                        onClick={resetReading}
                        className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
                      >
                        New Reading
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
