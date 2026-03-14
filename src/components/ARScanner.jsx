import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { analyzeCandlestick, getDirectionIcon, getDirectionColor, getSignalBgColor } from '../services/aiService'

const ARScanner = () => {
  const webcamRef = useRef(null)
  const fileInputRef = useRef(null)

  const [mode, setMode] = useState('camera')
  const [capturing, setCapturing] = useState(false)
  const [signal, setSignal] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const { language, addSignal, rotateGroqKey } = useStore()

  const labels = {
    en: {
      liveCamera: '📷 Live Camera',
      uploadScreenshot: '📸 Upload Screenshot',
      selectImage: 'Select Image',
      analyzing: 'Analyzing...',
      scanNow: 'SCAN NOW',
      cancel: 'Cancel',
      uploadTitle: 'Upload Screenshot',
      confidence: 'Confidence',
      reasoning: 'Reasoning',
      nextDirection: 'Next Move',
      strength: 'Strength'
    },
    ar: {
      liveCamera: '📷 كاميرا حية',
      uploadScreenshot: '📸 رفع لقطة شاشة',
      selectImage: 'اختر الصورة',
      analyzing: 'جاري التحليل...',
      scanNow: 'ابدأ المسح',
      cancel: 'إلغاء',
      uploadTitle: 'رفع لقطة شاشة',
      confidence: 'الثقة',
      reasoning: 'التحليل',
      nextDirection: 'الحركة القادمة',
      strength: 'الزخم'
    }
  }

  const t = labels[language]

  const analyzeImage = async (imageData) => {
    setCapturing(true)
    setSignal(null)
    try {
      const result = await analyzeCandlestick(imageData, language)
      setSignal(result)
      addSignal(result)
      rotateGroqKey()
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setCapturing(false)
    }
  }

  const captureAndAnalyze = () => {
    if (!webcamRef.current) return
    const imageSrc = webcamRef.current.getScreenshot()
    analyzeImage(imageSrc)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => setPreviewUrl(event.target.result)
    reader.readAsDataURL(file)
  }

  const analyzeUploadedImage = () => {
    if (!previewUrl) return
    analyzeImage(previewUrl)
  }

  const clearPreview = () => {
    setPreviewUrl(null)
    setSignal(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const StrengthBar = ({ strength }) => (
    <div className="flex gap-1 mt-3">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full ${
            i < strength ? 'bg-primary' : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  )

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex gap-3 glass-panel p-1 rounded-2xl">
        <motion.button
          onClick={() => {
            setMode('camera')
            clearPreview()
          }}
          className={`px-6 py-3 rounded-xl font-bold text-sm ${
            mode === 'camera' ? 'bg-primary text-black' : 'text-white hover:bg-white/10'
          }`}
        >
          {t.liveCamera}
        </motion.button>
        <motion.button
          onClick={() => {
            setMode('upload')
            setSignal(null)
          }}
          className={`px-6 py-3 rounded-xl font-bold text-sm ${
            mode === 'upload' ? 'bg-primary text-black' : 'text-white hover:bg-white/10'
          }`}
        >
          {t.uploadScreenshot}
        </motion.button>
      </div>

      {mode === 'camera' && (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="absolute inset-0 w-full h-full object-cover"
            videoConstraints={{ facingMode: 'environment' }}
          />
          <div className="absolute inset-0 ar-overlay" />
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute left-0 right-0 h-1 bg-primary/50"
          />
        </>
      )}

      {mode === 'upload' && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {!previewUrl ? (
            <div className="glass-panel p-10 text-center max-w-md">
              <div className="text-7xl mb-6">📸</div>
              <h2 className="text-3xl font-bold mb-6">{t.uploadTitle}</h2>
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-5 bg-primary text-black font-bold text-xl rounded-2xl hover:bg-primary/90"
              >
                {t.selectImage}
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="max-w-2xl w-full">
              <img src={previewUrl} className="w-full rounded-3xl border border-primary/30" alt="preview" />
              <div className="flex gap-4 mt-6">
                <motion.button
                  onClick={analyzeUploadedImage}
                  disabled={capturing}
                  className="flex-1 py-5 bg-primary text-black font-bold text-xl rounded-2xl disabled:opacity-50"
                >
                  {capturing ? t.analyzing : t.scanNow}
                </motion.button>
                <motion.button
                  onClick={clearPreview}
                  className="px-8 py-5 glass-panel font-bold text-xl rounded-2xl hover:bg-white/10"
                >
                  {t.cancel}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {signal && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`absolute inset-0 z-50 flex items-center justify-center p-6 pointer-events-none`}
          >
            <motion.div
              className={`glass-panel p-10 max-w-md w-full border-2 ${getSignalBgColor(signal.type, signal.nextDirection)}`}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div className="text-center space-y-6">
                <div className={`text-8xl font-black ${signal.type === 'BUY' ? 'text-green-400' : 'text-red-500'}`}>
                  {signal.type}
                </div>

                <div className="space-y-3 text-lg">
                  <div className="flex justify-between items-center">
                    <span className="opacity-75">{t.confidence}:</span>
                    <span className="font-bold text-xl text-primary">{signal.confidence}%</span>
                  </div>

                  <div className="flex justify-between items-start gap-2">
                    <span className="opacity-75">{t.reasoning}:</span>
                    <span className="font-semibold text-right flex-1">{signal.reasoning}</span>
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <span className="opacity-75">{t.nextDirection}:</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl ${getDirectionColor(signal.nextDirection)}`}>
                        {getDirectionIcon(signal.nextDirection)}
                      </span>
                      <span className="font-bold">{signal.nextDirectionText}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="opacity-75">{t.strength}:</span>
                    <span className="font-bold text-primary text-xl">{signal.strength}/10</span>
                  </div>
                </div>

                <StrengthBar strength={signal.strength} />

                {signal.isFallback && (
                  <div className="text-xs opacity-50 bg-white/5 rounded-lg p-2">
                    {language === 'ar' ? 'تحليل احتياطي' : 'Fallback analysis'}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'camera' && !signal && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-50">
          <motion.button
            onClick={captureAndAnalyze}
            disabled={capturing}
            className="px-12 py-5 bg-primary/20 border-4 border-primary rounded-full text-2xl font-bold hover:bg-primary/30 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {capturing ? t.analyzing : t.scanNow}
          </motion.button>
        </div>
      )}
    </div>
  )
}

export default ARScanner