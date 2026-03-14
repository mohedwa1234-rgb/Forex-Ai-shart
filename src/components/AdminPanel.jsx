import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { getDirectionIcon, getDirectionColor } from '../services/aiService'

const AdminPanel = () => {
  const { licenseKeys, groqKeys, signals, language } = useStore()
  const [activeTab, setActiveTab] = useState('performance')

  const labels = {
    en: {
      hub: "General's Hub",
      totalSignals: 'Total Signals',
      successRate: 'Success Rate',
      groqKeysCount: 'Groq Keys',
      activeUsers: 'Active Users',
      performance: 'Performance',
      groqKeysTab: 'Groq Keys',
      licenses: 'Licenses',
      systemPerformance: 'System Performance',
      groqApiKeys: 'Groq API Keys',
      licenseKeys: 'License Keys',
      noLicenses: 'No license keys yet',
      directionDistribution: 'Direction Distribution (Last 20)',
      upCount: 'Bullish Signals',
      downCount: 'Bearish Signals',
      sidewaysCount: 'Sideways Signals'
    },
    ar: {
      hub: 'مركز القيادة',
      totalSignals: 'إجمالي الإشارات',
      successRate: 'معدل النجاح',
      groqKeysCount: 'مفاتيح Groq',
      activeUsers: 'المستخدمين النشطين',
      performance: 'الأداء',
      groqKeysTab: 'مفاتيح Groq',
      licenses: 'التراخيص',
      systemPerformance: 'أداء النظام',
      groqApiKeys: 'مفاتيح Groq API',
      licenseKeys: 'مفاتيح الترخيص',
      noLicenses: 'لا يوجد مفاتيح ترخيص بعد',
      directionDistribution: 'توزيع الاتجاهات (آخر 20)',
      upCount: 'إشارات صعودية',
      downCount: 'إشارات هبوطية',
      sidewaysCount: 'إشارات جانبية'
    }
  }

  const t = labels[language]

  const recentSignals = signals.slice(0, 20)
  const upCount = recentSignals.filter(s => s.nextDirection === 'UP').length
  const downCount = recentSignals.filter(s => s.nextDirection === 'DOWN').length
  const sidewaysCount = recentSignals.filter(s => s.nextDirection === 'SIDEWAYS').length

  const directionData = [
    { name: language === 'ar' ? 'صعودي' : 'Bullish', value: upCount, fill: '#10b981' },
    { name: language === 'ar' ? 'هبوطي' : 'Bearish', value: downCount, fill: '#ef4444' },
    { name: language === 'ar' ? 'جانبي' : 'Sideways', value: sidewaysCount, fill: '#eab308' }
  ]

  const stats = [
    { name: t.totalSignals, value: signals.length },
    { name: t.successRate, value: '94.8%' },
    { name: t.groqKeysCount, value: groqKeys.length },
    { name: t.activeUsers, value: '1,247' }
  ]

  const performanceData = signals.slice(0, 15).map((s, i) => ({
    name: `#${i + 1}`,
    confidence: s.confidence,
    strength: s.strength
  }))

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-10 text-primary">{t.hub}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="glass-panel p-8 text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl font-bold text-gold">{s.value}</div>
              <div className="mt-2 opacity-75 text-sm">{s.name}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { id: 'performance', label: t.performance },
            { id: 'directions', label: 'Directions' },
            { id: 'groqkeys', label: t.groqKeysTab },
            { id: 'licenses', label: t.licenses }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-2xl font-bold transition ${
                activeTab === tab.id ? 'bg-primary text-black' : 'glass-panel hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'performance' && (
          <div className="glass-panel p-8">
            <h2 className="text-3xl mb-6 font-bold">{t.systemPerformance}</h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #00ff88',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="confidence" fill="#00ff88" name={language === 'ar' ? 'الثقة' : 'Confidence'} />
                  <Bar dataKey="strength" fill="#ffd700" name={language === 'ar' ? 'الزخم' : 'Strength'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'directions' && (
          <div className="glass-panel p-8">
            <h2 className="text-3xl mb-6 font-bold">{t.directionDistribution}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="h-80 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={directionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {directionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Cards */}
              <div className="space-y-4 flex flex-col justify-center">
                {[
                  { label: t.upCount, value: upCount, icon: '📈', color: 'text-green-400' },
                  { label: t.downCount, value: downCount, icon: '📉', color: 'text-red-500' },
                  { label: t.sidewaysCount, value: sidewaysCount, icon: '➡️', color: 'text-yellow-400' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                    initial={{ x: language === 'ar' ? 20 : -20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-3 justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      <span className={`text-3xl font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'groqkeys' && (
          <div className="glass-panel p-8">
            <h2 className="text-3xl mb-6 font-bold">{t.groqApiKeys}</h2>
            <div className="space-y-3">
              {groqKeys.length > 0 ? (
                groqKeys.map((k, i) => (
                  <motion.div
                    key={i}
                    className="p-4 bg-white/5 rounded-xl font-mono text-sm break-all border border-white/10 hover:border-primary/50 transition"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="opacity-50">[{i + 1}]</span> {k.substring(0, 30)}...{k.substring(k.length - 10)}
                  </motion.div>
                ))
              ) : (
                <p className="opacity-50">{language === 'ar' ? 'لا يوجد مفاتيح' : 'No keys available'}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'licenses' && (
          <div className="glass-panel p-8">
            <h2 className="text-3xl mb-6 font-bold">{t.licenseKeys}</h2>
            {licenseKeys.length === 0 ? (
              <p className="opacity-50">{t.noLicenses}</p>
            ) : (
              <div className="space-y-3">
                {licenseKeys.map((k, i) => (
                  <motion.div
                    key={i}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary/50 transition"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {k}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel