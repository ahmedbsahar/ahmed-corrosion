import { create } from 'zustand'

const useStore = create((set, get) => ({

  // ── THEME ──
  theme: localStorage.getItem('theme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : ''
    set({ theme })
  },

  // ── SIDEBAR ──
  sidebarCollapsed: false,
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // ── ACTIVE TAB ──
  activeTab: localStorage.getItem('lastTab') || 'dashboard',
  setActiveTab: (tab) => {
    localStorage.setItem('lastTab', tab)
    set({ activeTab: tab })
  },

  // ── STEPS ──
  steps: JSON.parse(localStorage.getItem('steps') || JSON.stringify(Array(8).fill(false))),
  toggleStep: (i) => {
    const steps = [...get().steps]
    steps[i] = !steps[i]
    localStorage.setItem('steps', JSON.stringify(steps))
    set({ steps })
  },

  // ── SAVED DATA ──
  savedData: JSON.parse(localStorage.getItem('savedData') || '[]'),
  addData: (entry) => {
    const savedData = [...get().savedData, { ...entry, id: Date.now() }]
    localStorage.setItem('savedData', JSON.stringify(savedData))
    set({ savedData })
  },
  clearData: () => {
    localStorage.removeItem('savedData')
    set({ savedData: [] })
  },

  // ── MICROMETER LOG ──
  microLog: [],
  addMicroLog: (entry) => set(s => ({ microLog: [entry, ...s.microLog] })),
  clearMicroLog: () => set({ microLog: [] }),

  // ── TIMER ──
  timerSecs: 0,
  timerRunning: false,
  timerAlarms: {},
  timerLog: [],
  setTimerSecs: (secs) => set({ timerSecs: secs }),
  setTimerRunning: (running) => set({ timerRunning: running }),
  addTimerAlarm: (h) => set(s => ({ timerAlarms: { ...s.timerAlarms, [h]: h * 3600 } })),
  addTimerLog: (msg) => set(s => ({
    timerLog: [
      { msg, time: new Date().toLocaleTimeString('ar') },
      ...s.timerLog.slice(0, 19),
    ]
  })),
  resetTimer: () => set({
    timerSecs: 0,
    timerRunning: false,
    timerAlarms: {},
    timerLog: [],
  }),

  // ── PHOTOS ──
  photos: [],
  addPhotos: (newPhotos) => set(s => ({ photos: [...s.photos, ...newPhotos] })),
  removePhoto: (i) => set(s => ({ photos: s.photos.filter((_, j) => j !== i) })),
  clearPhotos: () => set({ photos: [] }),

  // ── NOTIFICATIONS ──
  notify: (msg, type = '') => {
    const el = document.getElementById('notif')
    if (!el) return
    el.textContent = msg
    el.className = `notif show${type === 'warn' ? ' warn' : type === 'err' ? ' err' : ''}`
    clearTimeout(window._notifTimer)
    window._notifTimer = setTimeout(() => el.classList.remove('show'), 3000)
  },

}))

export default useStore