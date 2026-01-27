import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'
import Navigation from './components/Navigation'
import LanguageDetector from './components/LanguageDetector'

export const metadata: Metadata = {
  title: "Buster's Tarot Card Reader",
  description: 'Receive authentic tarot card readings with AI-powered interpretations',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <LanguageDetector />
          <Navigation />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
