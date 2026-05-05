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

export default function Topbar() {
  const {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    toggleSidebar,
    theme,
    setTheme,
    notify,
  } = useStore()

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
      background: theme === 'light'
        ? 'rgba(240,244,255,.92)'
        : 'rgba(4,8,15,.88)',
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

        {/* Toggle Sidebar */}
        <button
          onClick={toggleSidebar}
          title="Ctrl+B"
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'var(--card2)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: 'var(--text)',
            transition: 'all .18s',
          }}
        >☰</button>

        {/* Title */}
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

        {/* Timer */}
        <IconBtn onClick={() => setActiveTab('timer')} title="المؤقت Ctrl+T">⏱️</IconBtn>

        {/* PDF */}
        <IconBtn onClick={exportPDF} title="تصدير PDF Ctrl+P">📄</IconBtn>

        {/* Theme */}
        <IconBtn
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="تبديل المظهر Ctrl+D"
        >
          {theme === 'light' ? '☀️' : '🌙'}
        </IconBtn>

        {/* Fullscreen */}
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
        background: 'var(--card2)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, color: 'var(--text)',
        transition: 'all .18s',
        outline: 'none',
      }}
    >
      {children}
    </button>
  )
}