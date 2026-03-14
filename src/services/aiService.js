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
  "nextDirectionText": "Strong Bullish" or "Bearish" or "Sideways",
  "strength": number between 1-10
}

Rules:
- confidence must be 70-99
- strength indicates momentum (1-3 weak, 4-7 medium, 8-10 strong)
- If image is unclear or not a chart, use confidence 70-75 and explain`

const SYSTEM_PROMPT_AR = `أنت محلل تداول خبير متخصص في التعرف على أنماط الشموع اليابانية والتحليل الفني. حلل صورة الشموع المرفوعة ورد فقط بـ JSON صحيح (بدون markdown أو نصوص إضافية).

ردك يجب أن يكون بالضبط:
{
  "type": "BUY" أو "SELL",
  "confidence": رقم بين 70-99,
  "reasoning": "سبب قصير بالعربية",
  "nextDirection": "UP" أو "DOWN" أو "SIDEWAYS",
  "nextDirectionText": "صعودي قوي" أو "هبوطي" أو "جانبي",
  "strength": رقم بين 1-10
}

القواعد:
- الثقة يجب أن تكون 70-99
- strength يعبر عن الزخم (1-3 ضعيف، 4-7 متوسط، 8-10 قوي)
- إذا الصورة غير واضحة أو ليست شارت، استخدم ثقة 70-75 واشرح في السبب`

export const analyzeCandlestick = async (imageData, language = 'en') => {
  const { groqKeys, currentGroqIndex, rotateGroqKey } = useStore.getState()
  
  if (groqKeys.length === 0) {
    throw new Error('No Groq API keys available')
  }

  const apiKey = groqKeys[currentGroqIndex]
  const prompt = language === 'ar' ? SYSTEM_PROMPT_AR : SYSTEM_PROMPT_EN

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: prompt },
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageData } }
            ]
          }
        ],
        temperature: 0.2,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    )

    const content = response.data.choices[0].message.content
    const parsed = JSON.parse(content)

    // التحقق من الحقول المهمة
    if (!['BUY', 'SELL'].includes(parsed.type) ||
        typeof parsed.confidence !== 'number' ||
        parsed.confidence < 70 || parsed.confidence > 99) {
      throw new Error('Invalid response format')
    }

    rotateGroqKey()

    return {
      ...parsed,
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US'),
      isFallback: false
    }

  } catch (error) {
    console.error('Groq Vision failed:', error)
    rotateGroqKey()
    return generateFallbackSignal(language)
  }
}

function generateFallbackSignal(language = 'en') {
  const isBuy = Math.random() > 0.5
  return {
    type: isBuy ? 'BUY' : 'SELL',
    confidence: Math.floor(Math.random() * 15 + 75),
    reasoning: language === 'ar' ? 'تحليل احتياطي (Groq غير متاح)' : 'Fallback analysis (Groq unavailable)',
    nextDirection: ['UP', 'DOWN', 'SIDEWAYS'][Math.floor(Math.random() * 3)],
    nextDirectionText: language === 'ar'
      ? ['صعودي قوي', 'هبوطي', 'جانبي'][Math.floor(Math.random() * 3)]
      : ['Strong Bullish', 'Bearish', 'Sideways'][Math.floor(Math.random() * 3)],
    strength: Math.floor(Math.random() * 7 + 3),
    time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US'),
    isFallback: true
  }
}