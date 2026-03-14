import { create } from 'zustand'
import { persist } from 'zustand/middleware'



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
        const nextIndex = (state.currentGroqIndex + 1) % state.groqKeys.length
        set({ currentGroqIndex: nextIndex })
      },

      addSignal: (signal) => set((state) => ({
        signals: [signal, ...state.signals].slice(0, 100)
      })),

      clearSignals: () => set({ signals: [] }),

      updateMarketData: (data) => set({ marketData: data }),

      reset: () => set({
        language: 'en',
        isAdmin: false,
        user: null,
        signals: []
      })
    }),
    {
      name: 'visiontrade-storage',
      partialize: (state) => ({
        language: state.language,
        isAdmin: state.isAdmin,
        licenseKeys: state.licenseKeys,
        signals: state.signals
        // لا نحفظ groqKeys لأنها موجودة مباشرة في الكود
      })
    }
  )
)