'use client'

import { useState } from 'react'
import Image from 'next/image'
import { allCards, TarotCard } from '../data/tarotCards'
import jsPDF from 'jspdf'

interface SelectedCard {
  card: TarotCard
  isReversed: boolean
  position: string
  isRevealed: boolean
}

type ReadingStep = 'question' | 'shuffling' | 'ready' | 'past-prompt' | 'past-reading' | 'present-prompt' | 'present-reading' | 'future-prompt' | 'future-reading' | 'combined-reading'

export default function TarotPage() {
  const [step, setStep] = useState<ReadingStep>('question')
  const [question, setQuestion] = useState('')
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])
  const [shufflingProgress, setShufflingProgress] = useState(0)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [userInterpretation, setUserInterpretation] = useState('')
  const [aiInterpretation, setAiInterpretation] = useState('')
  const [conversationHistory, setConversationHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [cardReadings, setCardReadings] = useState<{[key: number]: string}>({})
  const [isDivining, setIsDivining] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [visitedSteps, setVisitedSteps] = useState<ReadingStep[]>(['question'])
  const [userInterpretations, setUserInterpretations] = useState<{[key: number]: string}>({})
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleQuestionChange = (text: string) => {
    setQuestion(text)
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
  }

  const getWordCountColor = () => {
    if (wordCount === 0) return 'bg-red-500'
    if (wordCount < 13) return 'bg-red-500'
    if (wordCount < 27) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getWordCountStatus = () => {
    if (wordCount === 0 || wordCount < 13) return 'More context needed to divine...'
    if (wordCount < 40) return 'Good... Keep digging!'
    return 'Excellent!'
  }

  const getWordCountWidth = () => {
    const percentage = Math.min((wordCount / 40) * 100, 100)
    return `${percentage}%`
  }

  const markStepVisited = (step: ReadingStep) => {
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step])
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = visitedSteps.indexOf(step)
    if (currentIndex > 0) {
      const prevStep = visitedSteps[currentIndex - 1]
      setStep(prevStep)
      
      // Restore the correct card index and user interpretation based on step
      if (prevStep === 'past-prompt' || prevStep === 'past-reading') {
        setCurrentCardIndex(0)
        setUserInterpretation(userInterpretations[0] || '')
      } else if (prevStep === 'present-prompt' || prevStep === 'present-reading') {
        setCurrentCardIndex(1)
        setUserInterpretation(userInterpretations[1] || '')
      } else if (prevStep === 'future-prompt' || prevStep === 'future-reading') {
        setCurrentCardIndex(2)
        setUserInterpretation(userInterpretations[2] || '')
      } else if (prevStep === 'ready') {
        // Figure out which card we're about to reveal
        if (!selectedCards[0].isRevealed) {
          setCurrentCardIndex(0)
        } else if (!selectedCards[1].isRevealed) {
          setCurrentCardIndex(1)
        } else if (!selectedCards[2].isRevealed) {
          setCurrentCardIndex(2)
        }
        setUserInterpretation('')
      }
      
      // Restore AI interpretation if on a reading step
      if (prevStep === 'past-reading') {
        setAiInterpretation(cardReadings[0] || '')
      } else if (prevStep === 'present-reading') {
        setAiInterpretation(cardReadings[1] || '')
      } else if (prevStep === 'future-reading') {
        setAiInterpretation(cardReadings[2] || '')
      }
    }
  }

  const goToNextStep = () => {
    const currentIndex = visitedSteps.indexOf(step)
    if (currentIndex < visitedSteps.length - 1) {
      const nextStep = visitedSteps[currentIndex + 1]
      setStep(nextStep)
      
      // Restore the correct card index and user interpretation based on step
      if (nextStep === 'past-prompt' || nextStep === 'past-reading') {
        setCurrentCardIndex(0)
        setUserInterpretation(userInterpretations[0] || '')
      } else if (nextStep === 'present-prompt' || nextStep === 'present-reading') {
        setCurrentCardIndex(1)
        setUserInterpretation(userInterpretations[1] || '')
      } else if (nextStep === 'future-prompt' || nextStep === 'future-reading') {
        setCurrentCardIndex(2)
        setUserInterpretation(userInterpretations[2] || '')
      } else if (nextStep === 'ready') {
        // Figure out which card we're about to reveal
        if (!selectedCards[0].isRevealed) {
          setCurrentCardIndex(0)
        } else if (!selectedCards[1].isRevealed) {
          setCurrentCardIndex(1)
        } else if (!selectedCards[2].isRevealed) {
          setCurrentCardIndex(2)
        }
        setUserInterpretation('')
      }
      
      // Restore AI interpretation if on a reading step
      if (nextStep === 'past-reading') {
        setAiInterpretation(cardReadings[0] || '')
      } else if (nextStep === 'present-reading') {
        setAiInterpretation(cardReadings[1] || '')
      } else if (nextStep === 'future-reading') {
        setAiInterpretation(cardReadings[2] || '')
      }
    }
  }

  const canGoNext = () => {
    const currentIndex = visitedSteps.indexOf(step)
    return currentIndex < visitedSteps.length - 1
  }

  const canGoPrevious = () => {
    const currentIndex = visitedSteps.indexOf(step)
    return currentIndex > 0
  }

  const startReading = () => {
    if (!question.trim()) {
      alert('Please enter your question or focus')
      return
    }
    setStep('shuffling')
    markStepVisited('shuffling')
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
        isRevealed: false,
      })
    }
    
    setSelectedCards(cards)
    setStep('ready')
    markStepVisited('ready')
    setCurrentCardIndex(0)
  }

  const handleCardClick = (index: number) => {
    // Only allow clicking if we're in 'ready' state and this is the current card
    if (step === 'ready' && index === currentCardIndex && !selectedCards[index].isRevealed) {
      // Reveal the card
      const updatedCards = [...selectedCards]
      updatedCards[index].isRevealed = true
      setSelectedCards(updatedCards)
      
      // Move to prompt step
      if (index === 0) {
        setStep('past-prompt')
        markStepVisited('past-prompt')
      } else if (index === 1) {
        setStep('present-prompt')
        markStepVisited('present-prompt')
      } else if (index === 2) {
        setStep('future-prompt')
        markStepVisited('future-prompt')
      }
    }
  }

  const skipUserInput = async () => {
    setUserInterpretation('')
    await getAiReading('')
  }

  const submitUserInterpretation = async () => {
    if (!userInterpretation.trim()) {
      alert('Please share your interpretation or click "Skip" to get the reading directly')
      return
    }
    
    // Save user interpretation before moving on
    setUserInterpretations(prev => ({
      ...prev,
      [currentCardIndex]: userInterpretation
    }))
    
    await getAiReading(userInterpretation)
  }

  const getAiReading = async (userInput: string) => {
    setLoading(true)
    setAiInterpretation('')
    
    try {
      const currentCard = selectedCards[currentCardIndex]
      
      const response = await fetch('/api/tarot-reading-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card: currentCard.card,
          question,
          userInterpretation: userInput || null,
          conversationHistory,
          position: currentCard.position,
          isReversed: currentCard.isReversed,
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiInterpretation(data.interpretation)
        setConversationHistory(data.conversationHistory)
        
        // Store individual card reading
        setCardReadings(prev => ({...prev, [currentCardIndex]: data.interpretation}))
        
        // Move to reading step
        if (currentCardIndex === 0) {
          setStep('past-reading')
          markStepVisited('past-reading')
        } else if (currentCardIndex === 1) {
          setStep('present-reading')
          markStepVisited('present-reading')
        } else if (currentCardIndex === 2) {
          setStep('future-reading')
          markStepVisited('future-reading')
        }
      } else {
        const error = await response.json()
        const errorMsg = error.error || 'Failed to get reading'
        setAiInterpretation(`⚠️ Error: ${errorMsg}`)
        
        // Still move to reading step so user can see the error
        if (currentCardIndex === 0) {
          setStep('past-reading')
          markStepVisited('past-reading')
        } else if (currentCardIndex === 1) {
          setStep('present-reading')
          markStepVisited('present-reading')
        } else if (currentCardIndex === 2) {
          setStep('future-reading')
          markStepVisited('future-reading')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setAiInterpretation('⚠️ Unable to connect to the reading service. Please check your API key and try again.')
      
      // Move to reading step so user can see the error
      if (currentCardIndex === 0) {
        setStep('past-reading')
        markStepVisited('past-reading')
      } else if (currentCardIndex === 1) {
        setStep('present-reading')
        markStepVisited('present-reading')
      } else if (currentCardIndex === 2) {
        setStep('future-reading')
        markStepVisited('future-reading')
      }
    } finally {
      setLoading(false)
    }
  }

  const moveToNextCard = () => {
    setUserInterpretation('')
    setAiInterpretation('')
    setCurrentCardIndex(currentCardIndex + 1)
    setStep('ready')
    markStepVisited('ready')
  }

  const getCombinedReading = async () => {
    setLoading(true)
    setIsDivining(true)
    setStep('combined-reading')
    markStepVisited('combined-reading')
    setAiInterpretation('')
    
    try {
      const response = await fetch('/api/tarot-reading-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          conversationHistory,
          allCards: selectedCards,
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setAiInterpretation(data.interpretation)
      } else {
        const error = await response.json()
        setAiInterpretation(`⚠️ Error: ${error.error || 'Failed to get combined reading'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setAiInterpretation('⚠️ Unable to connect to the reading service.')
    } finally {
      setLoading(false)
      setIsDivining(false)
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPos = 20

    // Title
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Tarot Card Reading', pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // Question
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Your Question:', margin, yPos)
    yPos += 7
    doc.setFontSize(11)
    doc.setFont('helvetica', 'italic')
    const questionLines = doc.splitTextToSize(question, maxWidth)
    doc.text(questionLines, margin, yPos)
    yPos += questionLines.length * 7 + 10

    // Cards drawn section with images
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Cards Drawn:', margin, yPos)
    yPos += 12

    // Display cards horizontally with images
    const cardWidth = 45
    const cardHeight = 67.5
    const cardSpacing = 10
    const totalCardsWidth = (cardWidth * 3) + (cardSpacing * 2)
    const startX = (pageWidth - totalCardsWidth) / 2

    // Get card images from DOM
    const cardImages = document.querySelectorAll('img')
    
    selectedCards.forEach((card, index) => {
      const xPos = startX + (index * (cardWidth + cardSpacing))
      
      // Add card image
      let cardImgElement: HTMLImageElement | null = null
      for (const img of Array.from(cardImages)) {
        if (img.src.includes(card.card.image)) {
          cardImgElement = img
          break
        }
      }

      if (cardImgElement && cardImgElement.complete) {
        try {
          doc.addImage(
            cardImgElement,
            'PNG',
            xPos,
            yPos,
            cardWidth,
            cardHeight,
            undefined,
            'FAST'
          )
        } catch (error) {
          console.error('Error adding card image:', error)
        }
      }

      // Add card label below image
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      const orientation = card.isReversed ? ' (Rev)' : ''
      doc.text(`${card.position}${orientation}`, xPos + cardWidth/2, yPos + cardHeight + 5, { align: 'center' })
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(card.card.name, xPos + cardWidth/2, yPos + cardHeight + 10, { align: 'center' })
    })

    yPos += cardHeight + 20

    // Add card meanings
    selectedCards.forEach((card, index) => {
      if (yPos > 240) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      const orientation = card.isReversed ? ' (Reversed)' : ' (Upright)'
      doc.text(`${card.position}: ${card.card.name}${orientation}`, margin, yPos)
      yPos += 7

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const meaning = card.isReversed ? card.card.reversed : card.card.upright
      const meaningLines = doc.splitTextToSize(meaning, maxWidth)
      doc.text(meaningLines, margin + 5, yPos)
      yPos += meaningLines.length * 5 + 8
    })
    yPos += 5

    // Individual readings
    selectedCards.forEach((card, index) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text(`${card.position} Card Interpretation:`, margin, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const reading = cardReadings[index] || 'Reading not available'
      const readingLines = doc.splitTextToSize(reading, maxWidth)
      doc.text(readingLines, margin, yPos)
      yPos += readingLines.length * 5 + 10
    })

    // Combined reading
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Combined Reading:', margin, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const combinedLines = doc.splitTextToSize(aiInterpretation, maxWidth)
    doc.text(combinedLines, margin, yPos)

    // Footer on all pages
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      const pageHeight = doc.internal.pageSize.getHeight()
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.text('Tarot Card Reading made with <3 by Buster Franken', pageWidth / 2, pageHeight - 20, { align: 'center' })
      doc.setFontSize(8)
      doc.text('Message me on WhatsApp at +31624877967 for more divinations,', pageWidth / 2, pageHeight - 14, { align: 'center' })
      doc.text('suggestions about the app or other questions', pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    // Save
    const date = new Date().toISOString().split('T')[0]
    doc.save(`tarot-reading-${date}.pdf`)
  }

  const resetReading = () => {
    setStep('question')
    setQuestion('')
    setSelectedCards([])
    setCurrentCardIndex(0)
    setUserInterpretation('')
    setAiInterpretation('')
    setConversationHistory([])
    setShufflingProgress(0)
    setVisitedSteps(['question'])
    setWordCount(0)
    setUserInterpretations({})
    setCardReadings({})
  }

  const getGuideText = () => {
    if (step === 'ready' && currentCardIndex === 0) return 'Click to turn over the Past card'
    if (step === 'ready' && currentCardIndex === 1) return 'Click to turn over the Present card'
    if (step === 'ready' && currentCardIndex === 2) return 'Click to turn over the Future card'
    return ''
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Mystical background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Demo Mode Banner */}
        <div className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-3 rounded-xl shadow-lg text-center">
          <p className="font-semibold">🎭 Demo Mode - No OpenAI Credits Used</p>
          <p className="text-sm mt-1">Experience the full flow with pre-written interpretations</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-2xl md:text-4xl font-light text-center text-gray-800 mb-2">
            Tarot Card Reading
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Three Card Spread: Past • Present • Future
          </p>

          {step === 'question' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-lg">
                  What question do you seek guidance on?
                </label>
                <p className="mb-3 text-sm text-gray-400">
                  More context gives for a more accurate reading. Everything you write is completely private.
                </p>
                <textarea
                  value={question}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  placeholder="What do I need to know about my career path? What concerns me? What am I hoping to understand?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={5}
                />
                
                {/* Word count progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 transition-all duration-300 ${getWordCountColor()}`}
                      style={{ width: getWordCountWidth() }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className={`text-sm font-medium ${
                      wordCount >= 40 ? 'text-green-600' : 
                      wordCount >= 13 ? 'text-orange-600' : 
                      'text-red-600'
                    }`}>
                      {getWordCountStatus()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {wordCount} {wordCount === 1 ? 'word' : 'words'}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-3">
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

          {(step === 'ready' || step.includes('prompt') || step.includes('reading')) && selectedCards.length > 0 && (
            <div className="space-y-8">
              {/* Guide text */}
              {step === 'ready' && (
                <div className="text-center">
                  <p className="text-lg text-purple-700 font-medium animate-pulse">
                    {getGuideText()}
                  </p>
                </div>
              )}

              {/* Cards - Desktop Grid */}
              <div className="hidden md:grid grid-cols-3 gap-6">
                {selectedCards.map((selectedCard, index) => (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      onClick={() => handleCardClick(index)}
                      className={`bg-gradient-to-br ${
                        selectedCard.isRevealed
                          ? selectedCard.isReversed
                            ? 'from-red-50 to-orange-50 border-red-300'
                            : 'from-blue-50 to-purple-50 border-blue-300'
                          : 'from-gray-100 to-gray-200 border-gray-300'
                      } border-2 rounded-xl p-4 shadow-lg flex flex-col items-center min-h-[500px] transition-all duration-300 ${
                        step === 'ready' && index === currentCardIndex && !selectedCard.isRevealed
                          ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-2'
                          : ''
                      } ${hoveredCard === index && step === 'ready' && index === currentCardIndex && !selectedCard.isRevealed ? 'scale-105' : ''}`}
                    >
                      {selectedCard.isRevealed ? (
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
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full flex-col w-full">
                          <div className="relative w-full aspect-[2/3] mb-4">
                            <Image
                              src="/cards/CardBacks.png"
                              alt="Card Back"
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 33vw"
                              unoptimized
                            />
                          </div>
                          <p className="text-sm text-gray-500 font-medium">{selectedCard.position}</p>
                          {step === 'ready' && index === currentCardIndex && (
                            <p className="text-xs text-purple-600 mt-2">Click to reveal</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cards - Mobile Carousel */}
              <div className="md:hidden">
                <div 
                  className="relative overflow-hidden"
                  onTouchStart={(e) => {
                    setTouchStart(e.targetTouches[0].clientX)
                  }}
                  onTouchMove={(e) => {
                    setTouchEnd(e.targetTouches[0].clientX)
                  }}
                  onTouchEnd={() => {
                    if (touchStart - touchEnd > 75 && mobileCarouselIndex < 2) {
                      setMobileCarouselIndex(mobileCarouselIndex + 1)
                    }
                    if (touchStart - touchEnd < -75 && mobileCarouselIndex > 0) {
                      setMobileCarouselIndex(mobileCarouselIndex - 1)
                    }
                  }}
                >
                  <div 
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${mobileCarouselIndex * 100}%)` }}
                  >
                    {selectedCards.map((selectedCard, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 px-4"
                      >
                        <div
                          onClick={() => handleCardClick(index)}
                          className={`bg-gradient-to-br ${
                            selectedCard.isRevealed
                              ? selectedCard.isReversed
                                ? 'from-red-50 to-orange-50 border-red-300'
                                : 'from-blue-50 to-purple-50 border-blue-300'
                              : 'from-gray-100 to-gray-200 border-gray-300'
                          } border-2 rounded-xl p-4 shadow-lg flex flex-col items-center min-h-[500px] transition-all duration-300 ${
                            step === 'ready' && index === currentCardIndex && !selectedCard.isRevealed
                              ? 'cursor-pointer active:shadow-2xl active:scale-95'
                              : ''
                          }`}
                        >
                          {selectedCard.isRevealed ? (
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
                                  sizes="100vw"
                                  unoptimized
                                />
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full flex-col w-full">
                              <div className="relative w-full aspect-[2/3] mb-4">
                                <Image
                                  src="/cards/CardBacks.png"
                                  alt="Card Back"
                                  fill
                                  className="object-contain"
                                  sizes="100vw"
                                  unoptimized
                                />
                              </div>
                              <p className="text-sm text-gray-500 font-medium">{selectedCard.position}</p>
                              {step === 'ready' && index === currentCardIndex && (
                                <p className="text-xs text-purple-600 mt-2">Tap to reveal</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {selectedCards.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => setMobileCarouselIndex(index)}
                      className={`transition-all duration-300 ${
                        index === mobileCarouselIndex
                          ? 'w-8 h-3 bg-purple-600 rounded-full'
                          : 'w-3 h-3 bg-purple-300 rounded-full'
                      }`}
                      aria-label={`View ${card.position} card`}
                    >
                      <span className="sr-only">{card.position}</span>
                    </button>
                  ))}
                </div>
                
                {/* Swipe hint */}
                <p className="text-center text-sm text-gray-500 mt-2 animate-pulse">
                  ← Swipe to view all cards →
                </p>
              </div>

              {/* Scroll hint - Mobile only */}
              {(step.includes('prompt') || step.includes('reading')) && (
                <div className="md:hidden flex justify-center mt-4">
                  <div className="flex flex-col items-center animate-bounce">
                    <p className="text-sm text-purple-600 font-medium mb-1">Scroll down</p>
                    <svg 
                      className="w-6 h-6 text-purple-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}

              {/* User interpretation prompt */}
              {step.includes('prompt') && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    What do you see in the {selectedCards[currentCardIndex].position} card?
                  </h3>
                  <p className="text-gray-700">
                    Before I share the traditional interpretation, what springs to mind when you look at this card? 
                    What catches your attention in relation to your question?
                  </p>
                  <textarea
                    value={userInterpretation}
                    onChange={(e) => setUserInterpretation(e.target.value)}
                    placeholder="Share your thoughts... what do you notice? what feelings arise?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                    disabled={loading}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={submitUserInterpretation}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium disabled:opacity-50"
                    >
                      {loading ? 'Getting reading...' : 'Share & Get Reading'}
                    </button>
                    <button
                      onClick={skipUserInput}
                      disabled={loading}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 font-medium disabled:opacity-50"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}

              {/* Divining Loading State */}
              {step === 'combined-reading' && isDivining && (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
                  </div>
                  <p className="text-2xl text-gray-700 mb-4 font-medium">Divining...</p>
                  <p className="text-gray-600">Weaving the threads of past, present, and future into your story</p>
                </div>
              )}

              {/* AI Reading */}
              {step.includes('reading') && aiInterpretation && !isDivining && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {step === 'combined-reading' ? 'Your Complete Reading' : `The ${selectedCards[currentCardIndex].position} Card`}
                  </h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {aiInterpretation}
                  </div>
                  
                  {step !== 'combined-reading' && currentCardIndex < 2 && (
                    <button
                      onClick={moveToNextCard}
                      className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
                    >
                      Continue to {selectedCards[currentCardIndex + 1].position} Card
                    </button>
                  )}
                  
                  {step === 'future-reading' && (
                    <button
                      onClick={getCombinedReading}
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium text-lg shadow-lg disabled:opacity-50"
                    >
                      {loading ? 'Weaving the story...' : 'Get Combined Reading'}
                    </button>
                  )}

                  {step === 'combined-reading' && (
                    <div className="space-y-3">
                      <button
                        onClick={downloadPDF}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium text-lg shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download Reading as PDF
                      </button>
                      <button
                        onClick={resetReading}
                        className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
                      >
                        New Reading
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {step !== 'shuffling' && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              {canGoPrevious() ? (
                <button
                  onClick={goToPreviousStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Previous Step
                </button>
              ) : (
                <div></div>
              )}

              {canGoNext() && (
                <button
                  onClick={goToNextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-200 font-medium"
                >
                  Next Step
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
