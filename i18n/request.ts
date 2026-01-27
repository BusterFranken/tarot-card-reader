import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { locales, defaultLocale, Locale } from './config'

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = cookies()
  const localeCookie = cookieStore.get('locale')?.value as Locale | undefined

  if (localeCookie && locales.includes(localeCookie)) {
    return {
      locale: localeCookie,
      messages: (await import(`../messages/${localeCookie}.json`)).default,
    }
  }

  // Fall back to browser's Accept-Language header
  const headersList = headers()
  const acceptLanguage = headersList.get('accept-language') || ''
  
  // Parse Accept-Language header to find best match
  const browserLocales = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().substring(0, 2).toLowerCase())
  
  const detectedLocale = browserLocales.find(lang => 
    locales.includes(lang as Locale)
  ) as Locale | undefined

  const locale = detectedLocale || defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
