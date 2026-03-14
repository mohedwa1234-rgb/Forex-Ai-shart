import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

const LanguageToggle = () => {
  const { language, setLanguage } = useStore()

  return (
    <motion.div
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed top-6 right-6 z-50 flex gap-2"
    >
      <motion.button
        onClick={() => setLanguage('en')}
        className={`px-6 py-3 rounded-2xl font-bold transition ${
          language === 'en' ? 'bg-primary text-black' : 'glass-panel hover:bg-white/10'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        EN
      </motion.button>
      <motion.button
        onClick={() => setLanguage('ar')}
        className={`px-6 py-3 rounded-2xl font-bold transition ${
          language === 'ar' ? 'bg-primary text-black' : 'glass-panel hover:bg-white/10'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        AR
      </motion.button>
    </motion.div>
  )
}

export default LanguageToggle