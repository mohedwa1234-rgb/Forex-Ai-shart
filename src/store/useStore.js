import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const groqKeys = import.meta.env.VITE_GROQ_API_KEYS
  ? import.meta.env.VITE_GROQ_API_KEYS.split(',').map(k => k.trim()).filter(k => k)
  : []

export const useStore = create(
  persist(
    (set, get) => ({
      language: 'en',
      isAdmin: false,
      user: null,
      licenseKeys: [],
      groqKeys,
      currentGroqIndex: 0,
      signals: [],
      marketData: {},

      setLanguage: (lang) => set({ language: lang }),

      toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),

      setUser: (user) => set({ user }),

      addLicenseKey: (key) => set((state) => ({
        licenseKeys: [...state.licenseKeys, key]
      })),

      rotateGroqKey: () => {
        const state = get()
        const nextIndex = state.groqKeys.length > 0
          ? (state.currentGroqIndex + 1) % state.groqKeys.length
          : 0
        set({ currentGroqIndex: nextIndex })
      },

      addSignal: (signal) => set((state) => ({
        signals: [signal, ...state.signals].slice(0, 100)
      })),

      clearSignals: () => set({ signals: [] }),

      updateMarketData: (data) => set({ marketData: data })
    }),
    {
      name: 'visiontrade-storage',
      partialize: (state) => ({
        language: state.language,
        licenseKeys: state.licenseKeys,
        signals: state.signals,
        isAdmin: state.isAdmin
      })
    }
  )
)