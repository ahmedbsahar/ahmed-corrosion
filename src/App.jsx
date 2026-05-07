import { useEffect, useState } from 'react'
import useStore from './store'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import logo from './assets/logo.png'

import Dashboard  from './pages/Dashboard'
import Overview   from './pages/Overview'
import Materials  from './pages/Materials'
import Steps      from './pages/Steps'
import Micrometer from './pages/Micrometer'
import Timer      from './pages/Timer'
import Calc       from './pages/Calc'
import Compare    from './pages/Compare'
import Stats      from './pages/Stats'
import Results    from './pages/Results'
import AI         from './pages/AI'
import Predict    from './pages/Predict'
import Charts     from './pages/Charts'
import Photos     from './pages/Photos'
import Report     from './pages/Report'
import Settings   from './pages/Settings'
import Shortcuts  from './pages/Shortcuts'

const PAGES = {
  dashboard:  <Dashboard />,
  overview:   <Overview />,
  materials:  <Materials />,
  steps:      <Steps />,
  micrometer: <Micrometer />,
  timer:      <Timer />,
  calc:       <Calc />,
  compare:    <Compare />,
  stats:      <Stats />,
  results:    <Results />,
  ai:         <AI />,
  predict:    <Predict />,
  charts:     <Charts />,
  photos:     <Photos />,
  report:     <Report />,
  settings:   <Settings />,
  shortcuts:  <Shortcuts />,
}

// ── تطبيق الثيم عند التحميل ──
const ALL_THEME_VARS = {
  'dark-amber': { '--bg0':'#04080f','--bg1':'#080f1c','--bg2':'#0c1526','--card':'#111827','--card2':'#162240','--border':'#1e2d4a','--border2':'#243559','--amber':'#f5a623','--amber2':'#e8941a','--amber3':'#ffc14d','--text':'#eef2ff','--text2':'#c4cfe8','--muted':'#5c7099' },
  'dark-blue':  { '--bg0':'#020912','--bg1':'#040e1f','--bg2':'#06132c','--card':'#091829','--card2':'#0d1f35','--border':'#122640','--border2':'#1a3050','--amber':'#3d8ef0','--amber2':'#2563eb','--amber3':'#60a5fa','--text':'#e8f0ff','--text2':'#b8ccf0','--muted':'#4a6080' },
  'dark-green': { '--bg0':'#020f08','--bg1':'#041a0e','--bg2':'#072415','--card':'#0a2e1a','--card2':'#0e3820','--border':'#144d2c','--border2':'#1a6038','--amber':'#00c896','--amber2':'#00a87e','--amber3':'#34d399','--text':'#e8fff4','--text2':'#b8e8d0','--muted':'#4a7060' },
  'dark-purple':{ '--bg0':'#07040f','--bg1':'#0e0820','--bg2':'#140c2e','--card':'#1a1035','--card2':'#201540','--border':'#2a1a52','--border2':'#342060','--amber':'#9d6fff','--amber2':'#7c3aed','--amber3':'#a78bfa','--text':'#f0eeff','--text2':'#ccc0f0','--muted':'#5a4880' },
  'dark-red':   { '--bg0':'#0f0204','--bg1':'#1a0408','--bg2':'#24060c','--card':'#2e0810','--card2':'#380a14','--border':'#4a0e1c','--border2':'#5a1224','--amber':'#ff4d6a','--amber2':'#e0304d','--amber3':'#ff7088','--text':'#fff0f2','--text2':'#f0c0c8','--muted':'#804050' },
  'dark-rose':  { '--bg0':'#0f0409','--bg1':'#1a0812','--bg2':'#240c1c','--card':'#2e1024','--card2':'#38142c','--border':'#4a1a3a','--border2':'#5a2048','--amber':'#f472b6','--amber2':'#db2777','--amber3':'#f9a8d4','--text':'#fff0f8','--text2':'#f0c0e0','--muted':'#804070' },
  'dark-gold':  { '--bg0':'#0a0800','--bg1':'#140f00','--bg2':'#1e1700','--card':'#281e00','--card2':'#322600','--border':'#403000','--border2':'#503c00','--amber':'#d4a017','--amber2':'#b8860b','--amber3':'#f0c040','--text':'#fff8e8','--text2':'#e8d8a0','--muted':'#806040' },
  'dark-cyan':  { '--bg0':'#020c0f','--bg1':'#041820','--bg2':'#062430','--card':'#082e3c','--card2':'#0a3848','--border':'#0e4860','--border2':'#125870','--amber':'#22d3ee','--amber2':'#0891b2','--amber3':'#67e8f9','--text':'#e8faff','--text2':'#b0e8f8','--muted':'#406878' },
  'light-clean':{ '--bg0':'#f0f4ff','--bg1':'#e8edf8','--bg2':'#dee6f5','--card':'#ffffff','--card2':'#f5f8ff','--border':'#c8d4ed','--border2':'#b8c6e0','--amber':'#3d8ef0','--amber2':'#2563eb','--amber3':'#60a5fa','--text':'#0a0f1e','--text2':'#1e2d4a','--muted':'#6b7fa3' },
  'light-warm': { '--bg0':'#fff8f0','--bg1':'#fef0e0','--bg2':'#fde8d0','--card':'#ffffff','--card2':'#fffaf5','--border':'#f0d8b0','--border2':'#e8c890','--amber':'#f5a623','--amber2':'#e8941a','--amber3':'#ffc14d','--text':'#1e0f00','--text2':'#3c2010','--muted':'#806040' },
}

const LIGHT_THEMES = ['light-clean', 'light-warm']
const THEME_PAIRS  = {
  'dark-amber':'light-clean','dark-blue':'light-clean','dark-green':'light-clean',
  'dark-purple':'light-clean','dark-red':'light-warm','dark-rose':'light-warm',
  'dark-gold':'light-warm','dark-cyan':'light-clean',
  'light-clean':'dark-amber','light-warm':'dark-gold',
}

export function applyThemeFull(themeId) {
  const vars = ALL_THEME_VARS[themeId]
  if (!vars) return
  const root = document.documentElement
  root.dataset.theme = LIGHT_THEMES.includes(themeId) ? 'light' : ''
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
  localStorage.setItem('selectedTheme', themeId)
}

export { THEME_PAIRS, LIGHT_THEMES }

export default function App() {
  const { activeTab, setActiveTab, sidebarCollapsed, toggleSidebar } = useStore()
  const [, forceUpdate] = useState(0)

  // ── تطبيق الثيم عند التحميل ──
  useEffect(() => {
    const saved = localStorage.getItem('selectedTheme') || 'dark-amber'
    applyThemeFull(saved)
  }, [])

  // ── استماع لتغيير الثيم ──
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('themeChanged', handler)
    return () => window.removeEventListener('themeChanged', handler)
  }, [])

  // ── اختصارات لوحة المفاتيح ──
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'b': e.preventDefault(); toggleSidebar(); break
          case 'd':
            e.preventDefault()
            const cur  = localStorage.getItem('selectedTheme') || 'dark-amber'
            const next = THEME_PAIRS[cur] || 'dark-amber'
            applyThemeFull(next)
            forceUpdate(n => n + 1)
            window.dispatchEvent(new Event('themeChanged'))
            break
          case 't': e.preventDefault(); setActiveTab('timer');  break
          case 'p': e.preventDefault(); window.print();         break
          case 'k': e.preventDefault(); setActiveTab('calc');   break
          case 'g': e.preventDefault(); setActiveTab('charts'); break
          case 'i': e.preventDefault(); setActiveTab('ai');     break
        }
      }
      if (e.key === 'F11') {
        e.preventDefault()
        document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen().catch(() => {})
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <Sidebar logo={logo} />

      {/* Main */}
      <div className={`main-area${sidebarCollapsed ? ' collapsed' : ''}`}>
        <Topbar />
        <div className="page-wrap fade-up" key={activeTab}>
          {PAGES[activeTab] || (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
              الصفحة غير موجودة
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      <div
        id="notif"
        style={{
          position: 'fixed', bottom: 22, left: '50%',
          transform: 'translateX(-50%) translateY(120px)',
          background: 'var(--green)', color: '#000',
          padding: '11px 26px', borderRadius: 13,
          fontWeight: 700, fontSize: 12.5, zIndex: 9999,
          transition: 'transform .4s cubic-bezier(.34,1.56,.64,1)',
          boxShadow: '0 8px 28px rgba(0,200,150,.5)',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}
      />

      <style>{`
        #notif.show { transform: translateX(-50%) translateY(0) !important; }
        #notif.warn { background: var(--orange) !important; }
        #notif.err  { background: var(--red) !important; color: #fff !important; }
      `}</style>
    </div>
  )
}