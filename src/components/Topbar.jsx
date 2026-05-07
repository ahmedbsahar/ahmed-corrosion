import useStore from '../store'

const TAB_TITLES = {
  dashboard: 'لوحة التحكم',
  overview:  'نظرة عامة',
  materials: 'المواد والتجهيز',
  steps:     'خطوات التجربة',
  micrometer:'الميكروميتر',
  timer:     'المؤقت الذكي',
  calc:      'حاسبة التآكل',
  compare:   'مقارنة الطلاءات',
  stats:     'التحليل الإحصائي',
  results:   'النتائج',
  ai:        'تحليل ذكي',
  predict:   'التنبؤ والتوقعات',
  charts:    'الرسوم البيانية',
  photos:    'توثيق الصور',
  report:    'التقرير الأكاديمي',
  settings:  'الإعدادات',
  shortcuts: 'الاختصارات',
}

// نفس الثيمات من Settings
const LIGHT_THEMES = ['light-clean', 'light-warm']

const THEME_PAIRS = {
  'dark-amber':  'light-clean',
  'dark-blue':   'light-clean',
  'dark-green':  'light-clean',
  'dark-purple': 'light-clean',
  'dark-red':    'light-warm',
  'dark-rose':   'light-warm',
  'dark-gold':   'light-warm',
  'dark-cyan':   'light-clean',
  'light-clean': 'dark-amber',
  'light-warm':  'dark-gold',
}

const ALL_THEME_VARS = {
  'dark-amber': {
    '--bg0': '#04080f', '--bg1': '#080f1c', '--bg2': '#0c1526',
    '--card': '#111827', '--card2': '#162240', '--border': '#1e2d4a', '--border2': '#243559',
    '--amber': '#f5a623', '--amber2': '#e8941a', '--amber3': '#ffc14d',
    '--text': '#eef2ff', '--text2': '#c4cfe8', '--muted': '#5c7099',
  },
  'dark-blue': {
    '--bg0': '#020912', '--bg1': '#040e1f', '--bg2': '#06132c',
    '--card': '#091829', '--card2': '#0d1f35', '--border': '#122640', '--border2': '#1a3050',
    '--amber': '#3d8ef0', '--amber2': '#2563eb', '--amber3': '#60a5fa',
    '--text': '#e8f0ff', '--text2': '#b8ccf0', '--muted': '#4a6080',
  },
  'dark-green': {
    '--bg0': '#020f08', '--bg1': '#041a0e', '--bg2': '#072415',
    '--card': '#0a2e1a', '--card2': '#0e3820', '--border': '#144d2c', '--border2': '#1a6038',
    '--amber': '#00c896', '--amber2': '#00a87e', '--amber3': '#34d399',
    '--text': '#e8fff4', '--text2': '#b8e8d0', '--muted': '#4a7060',
  },
  'dark-purple': {
    '--bg0': '#07040f', '--bg1': '#0e0820', '--bg2': '#140c2e',
    '--card': '#1a1035', '--card2': '#201540', '--border': '#2a1a52', '--border2': '#342060',
    '--amber': '#9d6fff', '--amber2': '#7c3aed', '--amber3': '#a78bfa',
    '--text': '#f0eeff', '--text2': '#ccc0f0', '--muted': '#5a4880',
  },
  'dark-red': {
    '--bg0': '#0f0204', '--bg1': '#1a0408', '--bg2': '#24060c',
    '--card': '#2e0810', '--card2': '#380a14', '--border': '#4a0e1c', '--border2': '#5a1224',
    '--amber': '#ff4d6a', '--amber2': '#e0304d', '--amber3': '#ff7088',
    '--text': '#fff0f2', '--text2': '#f0c0c8', '--muted': '#804050',
  },
  'dark-rose': {
    '--bg0': '#0f0409', '--bg1': '#1a0812', '--bg2': '#240c1c',
    '--card': '#2e1024', '--card2': '#38142c', '--border': '#4a1a3a', '--border2': '#5a2048',
    '--amber': '#f472b6', '--amber2': '#db2777', '--amber3': '#f9a8d4',
    '--text': '#fff0f8', '--text2': '#f0c0e0', '--muted': '#804070',
  },
  'dark-gold': {
    '--bg0': '#0a0800', '--bg1': '#140f00', '--bg2': '#1e1700',
    '--card': '#281e00', '--card2': '#322600', '--border': '#403000', '--border2': '#503c00',
    '--amber': '#d4a017', '--amber2': '#b8860b', '--amber3': '#f0c040',
    '--text': '#fff8e8', '--text2': '#e8d8a0', '--muted': '#806040',
  },
  'dark-cyan': {
    '--bg0': '#020c0f', '--bg1': '#041820', '--bg2': '#062430',
    '--card': '#082e3c', '--card2': '#0a3848', '--border': '#0e4860', '--border2': '#125870',
    '--amber': '#22d3ee', '--amber2': '#0891b2', '--amber3': '#67e8f9',
    '--text': '#e8faff', '--text2': '#b0e8f8', '--muted': '#406878',
  },
  'light-clean': {
    '--bg0': '#f0f4ff', '--bg1': '#e8edf8', '--bg2': '#dee6f5',
    '--card': '#ffffff', '--card2': '#f5f8ff', '--border': '#c8d4ed', '--border2': '#b8c6e0',
    '--amber': '#3d8ef0', '--amber2': '#2563eb', '--amber3': '#60a5fa',
    '--text': '#0a0f1e', '--text2': '#1e2d4a', '--muted': '#6b7fa3',
  },
  'light-warm': {
    '--bg0': '#fff8f0', '--bg1': '#fef0e0', '--bg2': '#fde8d0',
    '--card': '#ffffff', '--card2': '#fffaf5', '--border': '#f0d8b0', '--border2': '#e8c890',
    '--amber': '#f5a623', '--amber2': '#e8941a', '--amber3': '#ffc14d',
    '--text': '#1e0f00', '--text2': '#3c2010', '--muted': '#806040',
  },
}

function applyThemeFull(themeId) {
  const vars = ALL_THEME_VARS[themeId]
  if (!vars) return
  const root = document.documentElement
  root.dataset.theme = LIGHT_THEMES.includes(themeId) ? 'light' : ''
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
  localStorage.setItem('selectedTheme', themeId)
}

export default function Topbar() {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    toggleSidebar,
    notify,
  } = useStore()

const currentTheme = localStorage.getItem('selectedTheme') || 'dark-amber'
const isLight = ['light-clean', 'light-warm'].includes(currentTheme)

  const toggleTheme = () => {
    const next = THEME_PAIRS[currentTheme] || 'dark-amber'
    applyThemeFull(next)
    notify(LIGHT_THEMES.includes(next) ? '☀️ وضع النهار' : '🌙 وضع الليل')
    // إجبار إعادة رسم الـ Topbar
    window.dispatchEvent(new Event('themeChanged'))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen()
    }
  }

  const exportPDF = () => {
    notify('📄 افتح Ctrl+P واختر "حفظ كـ PDF"')
    setTimeout(() => window.print(), 600)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: sidebarCollapsed ? 60 : 240,
      left: 0,
      height: 58,
      zIndex: 200,
      background: isLight ? 'rgba(240,244,255,.92)' : 'rgba(4,8,15,.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      transition: 'right .28s, background .3s',
    }}>

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={toggleSidebar}
          title="Ctrl+B"
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'var(--card2)', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 16, color: 'var(--text)',
            transition: 'all .18s', outline: 'none',
          }}
        >☰</button>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>
            {TAB_TITLES[activeTab] || activeTab}
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>
            نظام تحليل التآكل وتطوير الطلاء الواقي للمعادن
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <IconBtn onClick={() => setActiveTab('timer')} title="المؤقت Ctrl+T">⏱️</IconBtn>
        <IconBtn onClick={exportPDF} title="تصدير PDF">📄</IconBtn>
        <IconBtn onClick={toggleTheme} title="تبديل المظهر Ctrl+D">
          {isLight ? '☀️' : '🌙'}
        </IconBtn>
        <IconBtn onClick={toggleFullscreen} title="ملء الشاشة F11">⛶</IconBtn>
      </div>
    </div>
  )
}

function IconBtn({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 34, height: 34, borderRadius: 9,
        background: 'var(--card2)', border: '1px solid var(--border)',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 15, color: 'var(--text)',
        transition: 'all .18s', outline: 'none',
      }}
    >
      {children}
    </button>
  )
}