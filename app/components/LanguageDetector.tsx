'use client'

import { useEffect } from 'react'
import { locales, Locale } from '../../i18n/config'

/**
 * Detects the browser's UI language (navigator.language) on first visit
 * and sets a cookie if it matches a supported locale.
 * This is more accurate than Accept-Language header which includes regional settings.
 */
export default function LanguageDetector() {
  useEffect(() => {
    // Check if locale cookie already exists
    const hasLocaleCookie = document.cookie
      .split(';')
      .some(cookie => cookie.trim().startsWith('locale='))
    
    if (hasLocaleCookie) {
      return // User already has a language preference
    }

    // Get browser UI language (e.g., "en-US", "nl", "de-DE")
    const browserLang = navigator.language
    
    // Extract the 2-letter language code
    const langCode = browserLang.substring(0, 2).toLowerCase() as Locale
    
    // Check if it matches a supported locale
    if (locales.includes(langCode) && langCode !== 'en') {
      // Set cookie and reload to apply the detected language
      document.cookie = `locale=${langCode};path=/;max-age=31536000` // 1 year
      window.location.reload()
    }
    // If browser is in English or unsupported language, do nothing (already showing English)
  }, [])

  return null // This component doesn't render anything
}
