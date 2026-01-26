'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export type VoiceInputStatus = 'idle' | 'ready' | 'recording' | 'processing' | 'error'

interface UseVoiceInputOptions {
  onTranscript?: (text: string) => void
  onError?: (error: string) => void
}

interface UseVoiceInputReturn {
  status: VoiceInputStatus
  error: string | null
  startRecording: () => void
  stopRecording: () => void
  warmUp: () => Promise<void>
  coolDown: () => void
  isSupported: boolean
}

/**
 * Custom hook for voice input using OpenAI Whisper API.
 * Handles microphone access, audio recording, and transcription.
 * Supports "warming up" the microphone for instant recording start.
 */
export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const { onTranscript, onError } = options
  
  const [status, setStatus] = useState<VoiceInputStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const warmUpTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if MediaRecorder is supported (needed for audio recording)
  const isSupported = typeof window !== 'undefined' && 
    'MediaRecorder' in window && 
    'navigator' in window && 
    'mediaDevices' in navigator

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (warmUpTimeoutRef.current) {
        clearTimeout(warmUpTimeoutRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const cleanup = useCallback((keepStream = false) => {
    // Stop all tracks in the stream (unless we want to keep it warm)
    if (!keepStream && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    mediaRecorderRef.current = null
    chunksRef.current = []
  }, [])

  const processAudio = useCallback(async (audioBlob: Blob) => {
    setStatus('processing')
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Transcription failed')
      }
      
      const data = await response.json()
      
      if (data.text) {
        onTranscript?.(data.text)
      }
      
      setStatus('idle')
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to transcribe audio'
      setError(errorMessage)
      setStatus('error')
      onError?.(errorMessage)
      
      // Reset to idle after showing error
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    }
  }, [onTranscript, onError])

  // Pre-warm the microphone (call on hover/focus for instant recording)
  const warmUp = useCallback(async () => {
    if (!isSupported || streamRef.current || status === 'recording') {
      return
    }

    // Clear any existing cooldown timeout
    if (warmUpTimeoutRef.current) {
      clearTimeout(warmUpTimeoutRef.current)
      warmUpTimeoutRef.current = null
    }

    try {
      // Try to find a real microphone (not virtual)
      const devices = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = devices.filter(d => d.kind === 'audioinput')
      console.log('Available microphones:', audioInputs.map(d => ({ id: d.deviceId, label: d.label })))
      
      // Prefer non-virtual devices (filter out Teams, Virtual, etc.)
      const realMic = audioInputs.find(d => 
        !d.label.toLowerCase().includes('virtual') && 
        !d.label.toLowerCase().includes('teams') &&
        d.deviceId !== 'default'
      ) || audioInputs.find(d => d.deviceId !== 'default') || audioInputs[0]
      
      const constraints: MediaStreamConstraints = realMic?.deviceId 
        ? { audio: { deviceId: { exact: realMic.deviceId } } }
        : { audio: true }
      
      console.log('Selected microphone:', realMic?.label || 'default')
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      streamRef.current = stream
      setStatus('ready')
      setError(null)
    } catch (err) {
      // Silently fail on warm-up - we'll show error on actual record attempt
      console.debug('Microphone warm-up failed:', err)
    }
  }, [isSupported, status])

  // Release the microphone (call on mouse leave)
  const coolDown = useCallback(() => {
    // Don't cool down if actively recording
    if (status === 'recording') {
      return
    }

    // Delay cooldown slightly in case user quickly returns
    warmUpTimeoutRef.current = setTimeout(() => {
      // Check actual recorder state (status may have changed since setTimeout was set)
      const isCurrentlyRecording = mediaRecorderRef.current?.state === 'recording'
      if (streamRef.current && !isCurrentlyRecording) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
        setStatus('idle')
      }
    }, 500)
  }, [status])

  const startRecording = useCallback(() => {
    if (!isSupported) {
      const msg = 'Voice recording is not supported in this browser'
      setError(msg)
      onError?.(msg)
      return
    }

    // Reset state
    setError(null)
    chunksRef.current = []

    // Use pre-warmed stream or request new one
    const initRecording = async (stream: MediaStream) => {
      // Log audio track details for debugging
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        console.log('Audio track:', audioTrack.label)
        console.log('Audio track settings:', audioTrack.getSettings())
        console.log('Audio track enabled:', audioTrack.enabled, 'muted:', audioTrack.muted)
      }

      // Determine the best supported audio format
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4'

      // Use higher bitrate for better quality
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        audioBitsPerSecond: 128000
      })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        console.log('Audio chunk received:', event.data.size, 'bytes')
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped. Chunks:', chunksRef.current.length, 'Total size:', chunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0))
        const audioBlob = new Blob(chunksRef.current, { type: mimeType })
        console.log('Audio blob created:', audioBlob.size, 'bytes, type:', audioBlob.type)
        cleanup(false) // Full cleanup after recording
        
        // Only process if we have actual audio data
        if (audioBlob.size > 0) {
          await processAudio(audioBlob)
        } else {
          setStatus('idle')
        }
      }

      mediaRecorder.onerror = () => {
        const msg = 'Recording error occurred'
        setError(msg)
        setStatus('error')
        onError?.(msg)
        cleanup(false)
      }

      // Start recording immediately
      mediaRecorder.start(100)
      setStatus('recording')
    }

    // If we have a pre-warmed stream, use it instantly
    if (streamRef.current) {
      initRecording(streamRef.current)
      return
    }

    // Otherwise, request microphone access (this is the slow path)
    // Try to find a real microphone (not virtual)
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      const audioInputs = devices.filter(d => d.kind === 'audioinput')
      console.log('Available microphones:', audioInputs.map(d => ({ id: d.deviceId, label: d.label })))
      
      // Prefer non-virtual devices
      const realMic = audioInputs.find(d => 
        !d.label.toLowerCase().includes('virtual') && 
        !d.label.toLowerCase().includes('teams') &&
        d.deviceId !== 'default'
      ) || audioInputs.find(d => d.deviceId !== 'default') || audioInputs[0]
      
      const constraints: MediaStreamConstraints = realMic?.deviceId 
        ? { audio: { deviceId: { exact: realMic.deviceId } } }
        : { audio: true }
      
      console.log('Selected microphone:', realMic?.label || 'default')
      
      return navigator.mediaDevices.getUserMedia(constraints)
    })
    .then(stream => {
      streamRef.current = stream
      initRecording(stream)
    })
    .catch(err => {
      let errorMessage = 'Failed to access microphone'
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = 'Microphone permission denied. Please allow microphone access and try again.'
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      setStatus('error')
      onError?.(errorMessage)
      cleanup(false)
      
      // Reset to idle after showing error
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    })
  }, [isSupported, cleanup, processAudio, onError])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  return {
    status,
    error,
    startRecording,
    stopRecording,
    warmUp,
    coolDown,
    isSupported,
  }
}
