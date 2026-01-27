'use client'

import { useState, useRef, useEffect } from 'react'
import { locales, localeNames, localeFlags, Locale } from '../../i18n/config'

interface LanguageSelectorProps {
  currentLocale: Locale
}

export default function LanguageSelector({ currentLocale }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (locale: Locale) => {
    // Set cookie
    document.cookie = `locale=${locale};path=/;max-age=31536000` // 1 year
    setIsOpen(false)
    // Reload page to apply new language
    window.location.reload()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
        aria-label="Select language"
      >
        <span className="text-lg sm:text-xl">{localeFlags[currentLocale]}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} hidden sm:block`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 py-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[160px] z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => changeLanguage(locale)}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-purple-50 transition-colors ${
                locale === currentLocale ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
              }`}
            >
              <span className="text-xl">{localeFlags[locale]}</span>
              <span className="font-medium">{localeNames[locale]}</span>
              {locale === currentLocale && (
                <svg className="w-4 h-4 ml-auto text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
