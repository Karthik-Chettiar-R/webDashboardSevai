import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/streak-fire-element.css'
import { useEffect, useState } from 'react'
import { generateRandomTheme, applyTheme, type Theme } from '../lib/theme-generator'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Force dark theme class
    document.documentElement.classList.add('dark')
    
    // Generate new random theme on every page load (no persistence)
    const theme = generateRandomTheme()
    applyTheme(theme)
    setCurrentTheme(theme)
    
    // Mark font as ready to load
    setFontLoaded(true)
    setMounted(true)
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  // Generate Google Fonts URL for the selected font
  const getFontUrl = () => {
    if (!currentTheme) return null
    
    // Extract font name from fontFamily for Google Fonts URL
    const fontName = currentTheme.fontName
    
    // For Geist Mono and Open Sans, load from Google Fonts
    // For monospace fonts, we'll use system fonts
    if (fontName === 'Geist Mono') {
      // Geist Mono might not be on Google Fonts, use system monospace
      return null
    }
    
    const fontFamily = fontName.replace(/ /g, '+')
    const weights = [300, 400, 500, 600, 700, 800].join(';')
    
    return `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weights}&display=swap`
  }

  return (
    <>
      <Head>
        {fontLoaded && currentTheme && (
          <>
            <link
              rel="preconnect"
              href="https://fonts.googleapis.com"
            />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
            />
            <link
              href={getFontUrl() || ''}
              rel="stylesheet"
            />
          </>
        )}
      </Head>
      <div className="dark">
        <Component {...pageProps} />
      </div>
    </>
  )
}
