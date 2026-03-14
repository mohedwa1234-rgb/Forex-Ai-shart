import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import TradingView from './components/TradingView'
import AdminPanel from './components/AdminPanel'
import ARScanner from './components/ARScanner'
import LanguageToggle from './components/LanguageToggle'
import { useStore } from './store/useStore'

function App() {
  const { language, isAdmin } = useStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <Router>
      <div
        className="min-h-screen bg-gray-900"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <LanguageToggle />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<TradingView />} />
            <Route path="/scan" element={<ARScanner />} />
            {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App