import axios from 'axios'
import { useStore } from '../store/useStore'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.2-11b-vision-preview'

const SYSTEM_PROMPT_EN = `You are an expert trading analyst specializing in candlestick pattern recognition and technical analysis. Analyze the provided candlestick chart image and respond ONLY with valid JSON (no markdown, no extra text).

Your response must be exactly:
{
  "type": "BUY" or "SELL",
  "confidence": number between 70-99,
  "reasoning": "brief reason in English",
  "nextDirection": "UP" or "DOWN" or "SIDEWAYS",
  "nextDirectionText": "Strong Bullish" or "Moderate Bullish" or "Bearish" or "Strong Bearish" or "Sideways",
  "strength": number between 1-10
}

Rules:
- Confidence must be between 70-99
- nextDirection must be: UP, DOWN, or SIDEWAYS
- Strength indicates momentum (1-3: weak, 4-7: medium, 8-10: strong)
- Analysis based on: patterns, support/resistance, volume, trends
- If unclear, use confidence 72-75`

const SYSTEM_PROMPT_AR = `أنت محلل تداول خبير متخصص في أنماط الشموع اليابانية والتحليل الفني. حلل صورة الشموع ورد بـ JSON فقط (بدون نصوص إضافية).

الرد يجب أن يكون:
{
  "type": "BUY" أو "SELL",
  "confidence": رقم بين 70-99,
  "reasoning": "سبب قصير بالعربية",
  "nextDirection": "UP" أو "DOWN" أو "SIDEWAYS",
  "nextDirectionText": "صعودي قوي" أو "صعودي معتدل" أو "هبوطي" أو "هبوطي قوي" أو "جانبي",
  "strength": رقم بين 1-10
}

القواعد:
- الثقة بين 70-99
- الاتجاه: UP أو DOWN أو SIDEWAYS
- القوة تشير للزخم (1-3: ضعيف، 4-7: متوسط، 8-10: قوي)
- بني التحليل على: الأنماط، الدعم والمقاومة، الحجم، الاتجاهات
- إذا غير واضحة، استخدم ثقة 72-75`

export const analyzeCandlestick = async (imageData, language = 'en') => {
  const store = useStore.getState()
  const { groqKeys, currentGroqIndex } = store
  
  if (!groqKeys || groqKeys.length === 0) {
    throw new Error(language === 'ar' ? 'لا توجد مفاتيح Groq' : 'No Groq API keys available')
  }

  const key = groqKeys[currentGroqIndex % groqKeys.length]
  const systemPrompt = language === 'ar' ? SYSTEM_PROMPT_AR : SYSTEM_PROMPT_EN

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: systemPrompt
              },
              {
                type: 'image_url',
                image_url: { url: imageData }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    const aiResponse = JSON.parse(response.data.choices[0].message.content)
    validateAIResponse(aiResponse)

    const result = {
      type: aiResponse.type,
      confidence: Math.max(70, Math.min(99, aiResponse.confidence)),
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US'),
      reasoning: aiResponse.reasoning || (language === 'ar' ? 'تحليل فني' : 'Technical analysis'),
      nextDirection: aiResponse.nextDirection,
      nextDirectionText: aiResponse.nextDirectionText,
      strength: Math.max(1, Math.min(10, aiResponse.strength || 5)),
      timestamp: Date.now(),
      language
    }

    store.rotateGroqKey()
    return result
  } catch (error) {
    console.error('Groq API Error:', error.message)
    store.rotateGroqKey()
    return generateFallbackSignal(language)
  }
}

const validateAIResponse = (response) => {
  const requiredFields = ['type', 'confidence', 'reasoning', 'nextDirection', 'nextDirectionText']
  const validTypes = ['BUY', 'SELL']
  const validDirections = ['UP', 'DOWN', 'SIDEWAYS']

  if (!requiredFields.every(field => field in response)) {
    throw new Error('Invalid response structure')
  }

  if (!validTypes.includes(response.type)) {
    throw new Error(`Invalid type: ${response.type}`)
  }

  if (!validDirections.includes(response.nextDirection)) {
    throw new Error(`Invalid direction: ${response.nextDirection}`)
  }

  if (typeof response.confidence !== 'number' || response.confidence < 70 || response.confidence > 99) {
    throw new Error(`Invalid confidence: ${response.confidence}`)
  }
}

const generateFallbackSignal = (language = 'en') => {
  const signals = [
    { type: 'BUY', dir: 'UP', text: language === 'ar' ? 'صعودي قوي' : 'Strong Bullish', reason: language === 'ar' ? 'تحليل احتياطي' : 'Fallback analysis' },
    { type: 'SELL', dir: 'DOWN', text: language === 'ar' ? 'هبوطي قوي' : 'Strong Bearish', reason: language === 'ar' ? 'تحليل احتياطي' : 'Fallback analysis' },
    { type: 'BUY', dir: 'SIDEWAYS', text: language === 'ar' ? 'جانبي' : 'Sideways', reason: language === 'ar' ? 'تحليل احتياطي' : 'Fallback analysis' }
  ]

  const signal = signals[Math.floor(Math.random() * signals.length)]

  return {
    type: signal.type,
    confidence: Math.floor(Math.random() * 10 + 72),
    time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US'),
    reasoning: signal.reason,
    nextDirection: signal.dir,
    nextDirectionText: signal.text,
    strength: Math.floor(Math.random() * 6 + 3),
    timestamp: Date.now(),
    isFallback: true,
    language
  }
}

export const getDirectionIcon = (direction) => {
  const icons = { UP: '📈', DOWN: '📉', SIDEWAYS: '➡️' }
  return icons[direction] || '•'
}

export const getDirectionColor = (direction) => {
  const colors = { UP: 'text-green-400', DOWN: 'text-red-500', SIDEWAYS: 'text-yellow-400' }
  return colors[direction] || 'text-gray-400'
}

export const getSignalBgColor = (type, direction) => {
  if (type === 'BUY') return direction === 'UP' ? 'bg-green-500/20 border-green-500' : 'bg-green-500/10 border-green-600'
  return direction === 'DOWN' ? 'bg-red-500/20 border-red-500' : 'bg-red-500/10 border-red-600'
}