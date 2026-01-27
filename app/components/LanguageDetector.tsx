'use client'

/**
 * Language detection disabled - navigator.language returns the browser's
 * language preferences list, not the UI display language. This causes
 * confusion when users have regional settings (like nl-NL) but display
 * their browser in English.
 * 
 * Instead, we default to English and let users manually select their
 * preferred language using the flag selector in the navigation bar.
 */
export default function LanguageDetector() {
  return null // No auto-detection - user selects manually
}
