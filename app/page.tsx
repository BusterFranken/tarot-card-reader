'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to tarot reading page
    router.push('/tarot')
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      <div className="text-white text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-white mb-4"></div>
        <p>Loading tarot reading...</p>
      </div>
    </main>
  )
}
