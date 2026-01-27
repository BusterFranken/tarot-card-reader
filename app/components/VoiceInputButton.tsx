'use client'

import { useTranslations } from 'next-intl'
import { useVoiceInput, VoiceInputStatus } from '../hooks/useVoiceInput'

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
  className?: string
}

/**
 * A microphone button that records audio and transcribes it using OpenAI Whisper.
 * Pre-warms the microphone on hover for instant recording start.
 * Shows visual feedback for recording/processing states.
 */
export default function VoiceInputButton({ 
  onTranscript, 
  disabled = false,
  className = ''
}: VoiceInputButtonProps) {
  const t = useTranslations('voice')
  const { status, error, startRecording, stopRecording, warmUp, coolDown, isSupported } = useVoiceInput({
    onTranscript,
  })

  if (!isSupported) {
    return null // Don't render if not supported
  }

  const handleClick = () => {
    if (disabled) return
    
    if (status === 'recording') {
      stopRecording()
    } else if (status === 'idle' || status === 'ready' || status === 'error') {
      startRecording()
    }
    // Don't do anything if processing
  }

  const handleMouseEnter = () => {
    if (!disabled && status === 'idle') {
      warmUp()
    }
  }

  const handleMouseLeave = () => {
    if (status === 'ready') {
      coolDown()
    }
  }

  const getButtonStyles = () => {
    const baseStyles = 'flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
    
    if (disabled) {
      return `${baseStyles} bg-gray-200 text-gray-400 cursor-not-allowed`
    }
    
    switch (status) {
      case 'recording':
        return `${baseStyles} bg-red-500 text-white hover:bg-red-600 animate-pulse`
      case 'processing':
        return `${baseStyles} bg-purple-400 text-white cursor-wait`
      case 'error':
        return `${baseStyles} bg-red-100 text-red-600 hover:bg-red-200`
      case 'ready':
        return `${baseStyles} bg-purple-200 text-purple-700 hover:bg-purple-300 ring-2 ring-purple-300`
      default:
        return `${baseStyles} bg-purple-100 text-purple-600 hover:bg-purple-200`
    }
  }

  const getIcon = () => {
    if (status === 'processing') {
      // Spinner icon
      return (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )
    }
    
    if (status === 'recording') {
      // Stop icon (square)
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      )
    }
    
    // Microphone icon
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
        />
      </svg>
    )
  }

  const getTooltip = () => {
    if (disabled) return t('disabled')
    switch (status) {
      case 'recording':
        return t('stopRecording')
      case 'processing':
        return t('transcribing')
      case 'error':
        return error || t('errorRetry')
      case 'ready':
        return t('ready')
      default:
        return t('startRecording')
    }
  }

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleClick}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        disabled={disabled || status === 'processing'}
        className={`${getButtonStyles()} w-10 h-10`}
        title={getTooltip()}
        aria-label={getTooltip()}
      >
        {getIcon()}
      </button>
      
      {/* Ready indicator - shows mic is warmed up */}
      {status === 'ready' && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      )}
      
      {/* Recording indicator */}
      {status === 'recording' && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
      
      {/* Error tooltip */}
      {status === 'error' && error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg whitespace-nowrap shadow-lg">
          {error}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-red-600"></div>
        </div>
      )}
    </div>
  )
}
