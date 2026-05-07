import { useState } from 'react'
import useStore from '../store'

const NAV = [
  {
    label: 'الرئيسية',
    items: [
      { icon: '🏠', id: 'dashboard', label: 'لوحة التحكم' },
      { icon: '📋', id: 'overview',  label: 'نظرة عامة' },
    ]
  },
  {
    label: 'التجربة',
    items: [
      { icon: '🧪', id: 'materials',  label: 'المواد والتجهيز' },
      { icon: '📝', id: 'steps',      label: 'خطوات التجربة' },
      { icon: '🔩', id: 'micrometer', label: 'الميكروميتر' },
      { icon: '⏱️', id: 'timer',      label: 'المؤقت الذكي' },
    ]
  },
  {
    label: 'التحليل',
    items: [
      { icon: '🧮', id: 'calc',    label: 'حاسبة التآكل' },
      { icon: '⚖️', id: 'compare', label: 'مقارنة الطلاءات' },
      { icon: '📐', id: 'stats',   label: 'التحليل الإحصائي' },
      { icon: '🏆', id: 'results', label: 'النتائج' },
    ]
  },
  {
    label: 'الذكاء الاصطناعي',
    items: [
      { icon: '🤖', id: 'ai',      label: 'تحليل ذكي' },
      { icon: '🔮', id: 'predict', label: 'التنبؤ والتوقعات' },
    ]
  },
  {
    label: 'البيانات',
    items: [
      { icon: '📊', id: 'charts', label: 'الرسوم البيانية' },
      { icon: '📸', id: 'photos', label: 'توثيق الصور' },
      { icon: '📄', id: 'report', label: 'التقرير الأكاديمي' },
    ]
  },
  {
    label: 'النظام',
    items: [
      { icon: '⚙️', id: 'settings',  label: 'الإعدادات' },
      { icon: '⌨️', id: 'shortcuts', label: 'الاختصارات' },
    ]
  },
]

export default function Sidebar({ logo }) {
  const { activeTab, setActiveTab, sidebarCollapsed } = useStore()
  const [logoOpen, setLogoOpen] = useState(false)

  // اسم الطالب من localStorage
  const studentName  = localStorage.getItem('studentName')  || 'أحمد بشار عقيل'
  const studentTitle = localStorage.getItem('studentTitle') || 'طالب'

  return (
    <>
      <nav style={{
        width: sidebarCollapsed ? 60 : 240,
        height: '100vh',
        background: 'var(--bg1)',
        borderLeft: '1px solid var(--border)',
        position: 'fixed',
        right: 0, top: 0, zIndex: 300,
        display: 'flex', flexDirection: 'column',
        transition: 'width .28s cubic-bezier(.4,0,.2,1)',
        overflowX: 'hidden', overflowY: 'auto',
      }}>

        {/* Brand */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 14px', borderBottom: '1px solid var(--border)',
          minHeight: 58, flexShrink: 0,
        }}>
          <img
            src={logo}
            alt="logo"
            onClick={() => setLogoOpen(true)}
            style={{
              width: 32, height: 32, objectFit: 'contain',
              borderRadius: 8, flexShrink: 0,
              cursor: 'zoom-in', transition: 'transform .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.18)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--amber)', lineHeight: 1.3 }}>
                مشروع أحمد الحسيني
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>
                الهندسة الكيمياوية — v3.0
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {NAV.map(section => (
            <div key={section.label} style={{ marginBottom: 4 }}>
              {!sidebarCollapsed && (
                <div style={{
                  fontSize: 8.5, fontWeight: 800, color: 'var(--muted)',
                  textTransform: 'uppercase', letterSpacing: 2,
                  padding: '3px 10px 2px', whiteSpace: 'nowrap',
                }}>
                  {section.label}
                </div>
              )}
              {section.items.map(item => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 11px', borderRadius: 10,
                    cursor: 'pointer', marginBottom: 2,
                    border: '1px solid transparent',
                    transition: 'all .18s',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    color: activeTab === item.id ? 'var(--amber)' : 'var(--muted)',
                    background: activeTab === item.id
                      ? 'linear-gradient(135deg,rgba(245,166,35,.15),rgba(0,200,150,.08))'
                      : 'transparent',
                    borderColor: activeTab === item.id ? 'rgba(245,166,35,.3)' : 'transparent',
                    fontWeight: 600, fontSize: 12.5,
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0, width: 18, textAlign: 'center' }}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div style={{ padding: '10px 10px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '9px 11px', background: 'var(--card)',
              borderRadius: 11, border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--amber), var(--green))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 900, color: '#000',
              }}>
                {studentName.charAt(0)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {studentName}
                </div>
                <div style={{ fontSize: 8.5, color: 'var(--muted)' }}>
                  {studentTitle}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Logo Modal */}
      {logoOpen && (
        <div
          onClick={() => setLogoOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.85)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
            backdropFilter: 'blur(10px)',
            animation: 'fadeUp .25s ease',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <img
              src={logo}
              alt="logo"
              style={{
                width: 300, height: 300,
                objectFit: 'contain',
                borderRadius: 24,
                boxShadow: '0 20px 60px rgba(0,0,0,.5)',
              }}
            />
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, marginTop: 16 }}>
              اضغط للإغلاق
            </div>
          </div>
        </div>
      )}
    </>
  )
}