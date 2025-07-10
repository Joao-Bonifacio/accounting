/* eslint-disable camelcase */
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import type { ReactNode } from 'react'
import Header from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import Footer from '@/components/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Accounting',
    default: 'Accounting',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <div className="relative">
            <div className="pb-20">{children}</div>
            <div className="absolute bottom-0 w-full pt-5">
              <Footer year={year} />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
