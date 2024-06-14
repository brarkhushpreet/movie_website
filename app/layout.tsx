import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'



export const metadata: Metadata = {
  title: 'Disney Clone',
  description: 'For educational purposes only',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className="dark:bg-[#1A1C29] bg-white">
        <ThemeProvider
         attribute="class"
         defaultTheme="dark"
         enableSystem
         disableTransitionOnChange
        >
         <Header/>
        {children}
        </ThemeProvider>
        </body>
    </html>
  )
}
