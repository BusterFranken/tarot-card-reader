'use client'

import { useState, useEffect, useRef } from 'react'

const STORAGE_PREFIX = 'tarot-reading-'

/**
 * A custom hook that persists state to localStorage.
 * Handles SSR hydration properly by:
 * 1. Starting with default value on both server and client (prevents hydration mismatch)
 * 2. Restoring from localStorage after mount via useEffect
 * 3. Persisting changes to localStorage on subsequent updates
 * 
 * @param key - The localStorage key (will be prefixed with 'tarot-reading-')
 * @param defaultValue - The default value if nothing is stored
 * @returns A tuple of [state, setState] similar to useState
 */
export function usePersistedState<T>(key: string, defaultValue: T) {
  const storageKey = `${STORAGE_PREFIX}${key}`
  
  // Always start with default value to avoid hydration mismatch
  const [state, setState] = useState<T>(defaultValue)
  
  // Track if we've completed initial hydration/restoration
  const [isHydrated, setIsHydrated] = useState(false)

  // Restore state from localStorage after mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) {
        const parsed = JSON.parse(stored) as T
        setState(parsed)
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${storageKey}":`, error)
    }
    setIsHydrated(true)
  }, [storageKey])

  // Persist state changes to localStorage (only after hydration)
  useEffect(() => {
    if (!isHydrated) {
      return
    }
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch (error) {
      console.error(`Error writing to localStorage key "${storageKey}":`, error)
    }
  }, [storageKey, state, isHydrated])

  return [state, setState] as const
}

/**
 * Clears all tarot reading data from localStorage.
 * Call this when starting a new reading.
 */
export function clearPersistedState() {
  if (typeof window === 'undefined') {
    return
  }
  
  // Get all keys that start with our prefix
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key)
    }
  }
  
  // Remove them
  keysToRemove.forEach(key => {
    localStorage.removeItem(key)
  })
}
