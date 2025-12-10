'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-1 py-3">
          <Link
            href="/"
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              pathname === '/'
                ? 'bg-gray-800 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Quotes
          </Link>
          <Link
            href="/tarot"
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              pathname === '/tarot'
                ? 'bg-gray-800 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Tarot Reading
          </Link>
        </div>
      </div>
    </nav>
  )
}

