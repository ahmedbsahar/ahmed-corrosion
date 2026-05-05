import { useEffect } from 'react'
import useStore from './store'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import logo from './assets/logo.png'

// Pages
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

export default function App() {
  const { activeTab, setActiveTab, theme, setTheme, sidebarCollapsed, toggleSidebar } = useStore()

  // ── Apply theme on load ──
  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : ''
  }, [theme])

  // ── Keyboard Shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'b': e.preventDefault(); toggleSidebar();           break
          case 'd': e.preventDefault(); setTheme(theme === 'light' ? 'dark' : 'light'); break
          case 't': e.preventDefault(); setActiveTab('timer');     break
          case 'p': e.preventDefault(); window.print();            break
          case 'k': e.preventDefault(); setActiveTab('calc');      break
          case 'g': e.preventDefault(); setActiveTab('charts');    break
          case 'i': e.preventDefault(); setActiveTab('ai');        break
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
  }, [theme])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <Sidebar logo={logo} />

      {/* Main */}
      <div style={{
        marginRight: sidebarCollapsed ? 60 : 240,
        paddingTop: 58,
        minHeight: '100vh',
        flex: 1,
        transition: 'margin-right .28s',
      }}>
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
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
          position: 'fixed',
          bottom: 22,
          left: '50%',
          transform: 'translateX(-50%) translateY(120px)',
          background: 'var(--green)',
          color: '#000',
          padding: '11px 26px',
          borderRadius: 13,
          fontWeight: 700,
          fontSize: 12.5,
          zIndex: 9999,
          transition: 'transform .4s cubic-bezier(.34,1.56,.64,1)',
          boxShadow: '0 8px 28px rgba(0,200,150,.5)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
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