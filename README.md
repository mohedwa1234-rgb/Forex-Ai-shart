# VisionTrade AI Core 👁️💹

تطبيق تداول احترافي مع تحليل AI + AR حقيقي

**Professional trading application with real AI + AR analysis**

---

## 🎯 المميزات | Features

- ✅ **كاميرا حية + رفع صور** - تحليل فوري للشموع اليابانية
  - Live camera + image upload - instant candlestick analysis

- ✅ **تحليل Groq Vision حقيقي** - نموذج Llama 3.2 Vision مع 8 مفاتيح API
  - Real Groq Vision analysis - Llama 3.2 Vision model with 8 API keys

- ✅ **إشارات التداول الذكية** - نوع الإشارة (BUY/SELL) + الثقة + الاتجاه المتوقع (UP/DOWN/SIDEWAYS)
  - Smart trading signals - signal type + confidence + next direction

- ✅ **واجهة عربي/إنجليزي كاملة** - RTL للعربية + دعم ثنائي اللغة
  - Full Arabic/English UI - RTL for Arabic + bilingual support

- ✅ **لوحة أدمن شاملة** - إحصائيات النظام + إدارة المفاتيح + توزيع الاتجاهات
  - Comprehensive admin panel - system stats + key management + direction distribution

- ✅ **جاهز للنشر على Vercel** - Vite + rewrites مُهيأة
  - Ready for Vercel deployment - Vite + rewrites configured

---

## 🚀 التشغيل محليًا | Local Development

### المتطلبات | Requirements
- Node.js 16+ و npm

### الخطوات | Steps

```bash
# 1. استنساخ المشروع | Clone repository
git clone https://github.com/mohedwa1234-rgb/visiontrade-ai-core.git
cd visiontrade-ai-core

# 2. تثبيت الحزم | Install dependencies
npm install

# 3. إعداد متغيرات البيئة | Setup environment
cp .env.example .env.local

# أضف مفاتيح Groq في .env.local | Add your Groq API keys in .env.local
# VITE_GROQ_API_KEYS=key1,key2,key3,...

# 4. تشغيل سيرفر التطوير | Run dev server
npm run dev

# سيفتح على http://localhost:3000
```

---

## 📦 البناء والنشر | Build & Deploy

### بناء للإنتاج | Production Build

```bash
npm run build
npm run preview  # لاختبار البناء محليًا
```

### النشر على Vercel | Deploy to Vercel

```bash
# الطريقة 1: عبر Git | Via Git
# 1. ادفع المشروع لـ GitHub
# 2. في Vercel: Connect GitHub repository
# 3. اضبط متغيرات البيئة (Environment Variables)
# 4. انقر Deploy

# الطريقة 2: Vercel CLI | Via CLI
npm i -g vercel
vercel
```

#### متغيرات البيئة في Vercel | Environment Variables in Vercel

في لوحة تحكم Vercel، أضف:

```
VITE_GROQ_API_KEYS=key1,key2,key3,key4,key5,key6,key7,key8
```

---

## ⚠️ الأمان | Security Notes

### ⛔ تحذيرات أمنية | Security Warnings

1. **لا تضع مفاتيح API في Git** - استخدم `.env.local` فقط
   - Never commit API keys to Git - use `.env.local` only

2. **استخدم متغيرات البيئة في الإنتاج**
   - Use environment variables in production

3. **قم بتدوير المفاتيح دوريًا**
   - Rotate API keys regularly

4. **لا تعرض مفاتيح في الـ Frontend Code**
   - Never expose keys in frontend code

### أفضل الممارسات | Best Practices

```javascript
// ✅ صحيح | Correct
const key = import.meta.env.VITE_GROQ_API_KEYS
// المتغير محمي بـ Vite

// ❌ خطأ | Wrong
const key = "gsk_xxx..."  // لا تفعل هذا | Don't do this
```

---

## 📁 هيكل المشروع | Project Structure

```
visiontrade-ai-core/
├── src/
│   ├── components/
│   │   ├── ARScanner.jsx          # كاميرا حية + رفع صور
│   │   ├── TradingView.jsx        # لوحة التداول الرئيسية
│   │   ├── AdminPanel.jsx         # لوحة الإدارة
│   │   └── LanguageToggle.jsx     # مبدل اللغة
│   ├── services/
│   │   ├── aiService.js           # تكامل Groq Vision
│   │   └── marketService.js       # بيانات السوق
│   ├── store/
│   │   └── useStore.js            # إدارة الحالة (Zustand)
│   ├── App.jsx                    # التطبيق الرئيسي
│   ├── main.jsx                   # نقطة الدخول
│   └── index.css                  # الأنماط العامة
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
└── vercel.json
```

---

## 🔧 المتغيرات المتاحة | Available Variables

### .env.local

```env
# مفاتيح Groq API (مفصولة بفواصل) | Groq API Keys (comma-separated)
VITE_GROQ_API_KEYS=key1,key2,key3,...
```

---

## 📊 البيانات المحفوظة | Data Persistence

التطبيق يحفظ البيانات التالية محليًا:

- اللغة المختارة | Selected language
- الإشارات السابقة (آخر 100) | Previous signals (last 100)
- مفاتيح الترخيص | License keys
- حالة الأدمن | Admin status

---

## 🛠️ التطوير | Development

### الأوامر | Commands

```bash
npm run dev      # تشغيل سيرفر التطوير
npm run build    # بناء للإنتاج
npm run preview  # معاينة البناء
```

### التبعيات الرئيسية | Main Dependencies

- **React 18** - واجهة المستخدم
- **Vite** - بناء سريع
- **TailwindCSS** - أنماط
- **Zustand** - إدارة الحالة
- **Framer Motion** - الحركات
- **Recharts** - الرسوم البيانية
- **Axios** - HTTP client
- **React Router** - التوجيه
- **React Webcam** - الكاميرا

---

## 🎨 الألوان المخصصة | Custom Colors

```
Primary: #00ff88 (أخضر مشع) - Green neon
Secondary: #ff4655 (أحمر)    - Red
Gold: #ffd700 (ذهبي)         - Gold
```

---

## 📝 الترخيص | License

هذا المشروع مفتوح المصدر ومتاح للاستخدام الشخصي والتجاري.

This project is open source and available for personal and commercial use.

---

## 📞 الدعم | Support

للمزيد من المعلومات أو الدعم:
- GitHub Issues: https://github.com/mohedwa1234-rgb/visiontrade-ai-core/issues

---

**تم البناء بـ ❤️ من مصر | Built with ❤️ from Egypt**