import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '../store/useStore'
import { getDirectionIcon, getDirectionColor } from '../services/aiService'

const TradingView = () => {
  const { language, signals } = useStore()
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        time: new Date().toLocaleTimeString(),
        value: Math.random() * 100 + 100
      }
      setChartData(prev => [...prev.slice(-50), newData])
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const labels = {
    en: {
      title: 'VisionTrade AI Core',
      latestSignals: 'Latest Signals',
      noSignals: 'Upload an image or use the camera to start analyzing',
      confidence: 'Confidence',
      direction: 'Direction',
      reasoning: 'Analysis'
    },
    ar: {
      title: 'فيجن تريد AI كور',
      latestSignals: 'آخر الإشارات',
      noSignals: 'ارفع صورة أو استخدم الكاميرا لبدء التحليل',
      confidence: 'الثقة',
      direction: 'الاتجاه',
      reasoning: 'التحليل'
    }
  }

  const t = labels[language]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 mb-8"
      >
        <h1 className="text-4xl font-bold mb-6 text-primary">{t.title}</h1>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #00ff88',
                  borderRadius: '12px'
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#00ff88" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-8">
        <h2 className="text-3xl font-bold mb-6">{t.latestSignals}</h2>

        <div className="space-y-4 max-h-[600px] overflow-auto">
          {signals.length === 0 ? (
            <p className="text-center opacity-50 py-8">{t.noSignals}</p>
          ) : (
            signals.map((signal, i) => (
              <motion.div
                key={i}
                initial={{ x: language === 'ar' ? 30 : -30 }}
                animate={{ x: 0 }}
                className={`p-6 rounded-2xl border-2 transition ${
                  signal.type === 'BUY'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-red-500 bg-red-500/10'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left side: Signal Type & Confidence */}
                  <div className="flex items-start gap-4">
                    <div className={`text-6xl font-black ${signal.type === 'BUY' ? 'text-green-400' : 'text-red-500'}`}>
                      {signal.type}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-sm opacity-75">{signal.time}</div>
                      <div className="text-2xl font-bold">{signal.confidence}%</div>
                      <div className="text-xs opacity-50">
                        {signal.isFallback && `(${language === 'ar' ? 'احتياطي' : 'Fallback'})`}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Direction & Analysis */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm opacity-75">{t.direction}:</span>
                      <span className={`text-3xl ${getDirectionColor(signal.nextDirection)}`}>
                        {getDirectionIcon(signal.nextDirection)}
                      </span>
                      <span className="font-bold text-lg">{signal.nextDirectionText}</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(signal.strength / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="opacity-75">{t.reasoning}: </span>
                      <span className="font-semibold">{signal.reasoning}</span>
                    </div>

                    <div className="text-xs opacity-60 bg-white/5 rounded p-2">
                      {language === 'ar' ? 'زخم' : 'Strength'}: {signal.strength}/10
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default TradingView