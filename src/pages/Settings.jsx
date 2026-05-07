import { useState, useEffect } from 'react'
import useStore from '../store'

// ══════════════════════════════
//  الثيمات الكاملة
// ══════════════════════════════
const THEMES = [
  {
    id: 'dark-amber',
    name: 'داكن ذهبي',
    icon: '🌙',
    preview: ['#04080f', '#f5a623', '#00c896'],
    vars: {
      '--bg0': '#04080f', '--bg1': '#080f1c', '--bg2': '#0c1526',
      '--card': '#111827', '--card2': '#162240', '--border': '#1e2d4a', '--border2': '#243559',
      '--amber': '#f5a623', '--amber2': '#e8941a', '--amber3': '#ffc14d',
      '--text': '#eef2ff', '--text2': '#c4cfe8', '--muted': '#5c7099',
    }
  },
  {
    id: 'dark-blue',
    name: 'أزرق عميق',
    icon: '🌊',
    preview: ['#020912', '#3d8ef0', '#00c896'],
    vars: {
      '--bg0': '#020912', '--bg1': '#040e1f', '--bg2': '#06132c',
      '--card': '#091829', '--card2': '#0d1f35', '--border': '#122640', '--border2': '#1a3050',
      '--amber': '#3d8ef0', '--amber2': '#2563eb', '--amber3': '#60a5fa',
      '--text': '#e8f0ff', '--text2': '#b8ccf0', '--muted': '#4a6080',
    }
  },
  {
    id: 'dark-green',
    name: 'أخضر داكن',
    icon: '🌲',
    preview: ['#020f08', '#00c896', '#3d8ef0'],
    vars: {
      '--bg0': '#020f08', '--bg1': '#041a0e', '--bg2': '#072415',
      '--card': '#0a2e1a', '--card2': '#0e3820', '--border': '#144d2c', '--border2': '#1a6038',
      '--amber': '#00c896', '--amber2': '#00a87e', '--amber3': '#34d399',
      '--text': '#e8fff4', '--text2': '#b8e8d0', '--muted': '#4a7060',
    }
  },
  {
    id: 'dark-purple',
    name: 'بنفسجي ليلي',
    icon: '🌌',
    preview: ['#07040f', '#9d6fff', '#f472b6'],
    vars: {
      '--bg0': '#07040f', '--bg1': '#0e0820', '--bg2': '#140c2e',
      '--card': '#1a1035', '--card2': '#201540', '--border': '#2a1a52', '--border2': '#342060',
      '--amber': '#9d6fff', '--amber2': '#7c3aed', '--amber3': '#a78bfa',
      '--text': '#f0eeff', '--text2': '#ccc0f0', '--muted': '#5a4880',
    }
  },
  {
    id: 'dark-red',
    name: 'أحمر داكن',
    icon: '🔴',
    preview: ['#0f0204', '#ff4d6a', '#f5a623'],
    vars: {
      '--bg0': '#0f0204', '--bg1': '#1a0408', '--bg2': '#24060c',
      '--card': '#2e0810', '--card2': '#380a14', '--border': '#4a0e1c', '--border2': '#5a1224',
      '--amber': '#ff4d6a', '--amber2': '#e0304d', '--amber3': '#ff7088',
      '--text': '#fff0f2', '--text2': '#f0c0c8', '--muted': '#804050',
    }
  },
  {
    id: 'dark-rose',
    name: 'وردي ليلي',
    icon: '🌸',
    preview: ['#0f0409', '#f472b6', '#9d6fff'],
    vars: {
      '--bg0': '#0f0409', '--bg1': '#1a0812', '--bg2': '#240c1c',
      '--card': '#2e1024', '--card2': '#38142c', '--border': '#4a1a3a', '--border2': '#5a2048',
      '--amber': '#f472b6', '--amber2': '#db2777', '--amber3': '#f9a8d4',
      '--text': '#fff0f8', '--text2': '#f0c0e0', '--muted': '#804070',
    }
  },
  {
    id: 'dark-gold',
    name: 'ذهبي ملكي',
    icon: '👑',
    preview: ['#0a0800', '#d4a017', '#c0392b'],
    vars: {
      '--bg0': '#0a0800', '--bg1': '#140f00', '--bg2': '#1e1700',
      '--card': '#281e00', '--card2': '#322600', '--border': '#403000', '--border2': '#503c00',
      '--amber': '#d4a017', '--amber2': '#b8860b', '--amber3': '#f0c040',
      '--text': '#fff8e8', '--text2': '#e8d8a0', '--muted': '#806040',
    }
  },
  {
    id: 'dark-cyan',
    name: 'سماوي داكن',
    icon: '🔵',
    preview: ['#020c0f', '#22d3ee', '#9d6fff'],
    vars: {
      '--bg0': '#020c0f', '--bg1': '#041820', '--bg2': '#062430',
      '--card': '#082e3c', '--card2': '#0a3848', '--border': '#0e4860', '--border2': '#125870',
      '--amber': '#22d3ee', '--amber2': '#0891b2', '--amber3': '#67e8f9',
      '--text': '#e8faff', '--text2': '#b0e8f8', '--muted': '#406878',
    }
  },
  {
    id: 'light-clean',
    name: 'فاتح نظيف',
    icon: '☀️',
    preview: ['#f0f4ff', '#3d8ef0', '#00c896'],
    vars: {
      '--bg0': '#f0f4ff', '--bg1': '#e8edf8', '--bg2': '#dee6f5',
      '--card': '#ffffff', '--card2': '#f5f8ff', '--border': '#c8d4ed', '--border2': '#b8c6e0',
      '--amber': '#3d8ef0', '--amber2': '#2563eb', '--amber3': '#60a5fa',
      '--text': '#0a0f1e', '--text2': '#1e2d4a', '--muted': '#6b7fa3',
    }
  },
  {
    id: 'light-warm',
    name: 'فاتح دافئ',
    icon: '🌤️',
    preview: ['#fff8f0', '#f5a623', '#00c896'],
    vars: {
      '--bg0': '#fff8f0', '--bg1': '#fef0e0', '--bg2': '#fde8d0',
      '--card': '#ffffff', '--card2': '#fffaf5', '--border': '#f0d8b0', '--border2': '#e8c890',
      '--amber': '#f5a623', '--amber2': '#e8941a', '--amber3': '#ffc14d',
      '--text': '#1e0f00', '--text2': '#3c2010', '--muted': '#806040',
    }
  },
]

function applyTheme(themeId) {
  const t = THEMES.find(x => x.id === themeId)
  if (!t) return
  const root = document.documentElement
  // تطبيق الوضع فاتح أو داكن
  if (themeId.startsWith('light')) {
    root.dataset.theme = 'light'
  } else {
    root.dataset.theme = ''
  }
  // تطبيق الألوان
  Object.entries(t.vars).forEach(([k, v]) => root.style.setProperty(k, v))
  localStorage.setItem('selectedTheme', themeId)
}

export default function Settings() {
  const { notify } = useStore()

  const [selectedTheme, setSelectedTheme] = useState(
    () => localStorage.getItem('selectedTheme') || 'dark-amber'
  )

  const [userInfo, setUserInfo] = useState(() => ({
    studentName:     localStorage.getItem('studentName')     || 'أحمد بشار عقيل',
    studentTitle:    localStorage.getItem('studentTitle')    || 'طالب',
    supervisor:      localStorage.getItem('supervisor')      || '',
    supervisorTitle: localStorage.getItem('supervisorTitle') || 'أ.د.',
    university:      localStorage.getItem('university')      || 'جامعة القادسية',
    college:         localStorage.getItem('college')         || 'كلية الهندسة',
    dept:            localStorage.getItem('dept')            || 'قسم الهندسة الكيمياوية',
  }))

  useEffect(() => {
    applyTheme(selectedTheme)
  }, [])

  const handleTheme = (id) => {
    setSelectedTheme(id)
    applyTheme(id)
    notify('🎨 تم تغيير الثيم')
  }

  const upd = (k, v) => setUserInfo(p => ({ ...p, [k]: v }))

  const saveUserInfo = () => {
    Object.entries(userInfo).forEach(([k, v]) => localStorage.setItem(k, v))
    notify('✅ تم حفظ المعلومات')
  }

  const exportData = () => {
    const data = {
      savedData:     JSON.parse(localStorage.getItem('savedData') || '[]'),
      steps:         JSON.parse(localStorage.getItem('steps')     || '[]'),
      selectedTheme: localStorage.getItem('selectedTheme'),
      userInfo,
      timestamp:     new Date().toISOString(),
      project:       'مشروع أحمد بشار عقيل v3.0',
    }
    const a = document.createElement('a')
    a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2))
    a.download = 'ahmed_project_backup.json'
    a.click()
    notify('📤 تم تصدير كل البيانات')
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => {
        try {
          const d = JSON.parse(ev.target.result)
          if (d.savedData)     localStorage.setItem('savedData',     JSON.stringify(d.savedData))
          if (d.steps)         localStorage.setItem('steps',         JSON.stringify(d.steps))
          if (d.selectedTheme) { applyTheme(d.selectedTheme); localStorage.setItem('selectedTheme', d.selectedTheme) }
          notify('📥 تم الاستيراد — سيتم إعادة التحميل')
          setTimeout(() => window.location.reload(), 1500)
        } catch {
          notify('❌ خطأ في الملف', 'err')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> النظام <span>›</span> الإعدادات</div>
        <h2>إعدادات النظام</h2>
        <p>تخصيص الثيم والمعلومات وإدارة البيانات</p>
      </div>

      {/* ── الثيمات ── */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 16, fontSize: 13.5 }}>
          🎨 اختر ثيم النظام
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          {THEMES.map(t => (
            <div
              key={t.id}
              onClick={() => handleTheme(t.id)}
              style={{
                borderRadius: 12, padding: '12px 14px',
                cursor: 'pointer', transition: 'all .2s',
                border: `2px solid ${selectedTheme === t.id ? 'var(--amber)' : 'var(--border)'}`,
                background: selectedTheme === t.id ? 'rgba(245,166,35,.08)' : 'var(--card)',
                transform: selectedTheme === t.id ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {/* Preview Colors */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                {t.preview.map((clr, i) => (
                  <div key={i} style={{
                    flex: 1, height: 8, borderRadius: 99, background: clr,
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: selectedTheme === t.id ? 'var(--amber)' : 'var(--text)' }}>
                {t.name}
              </div>
              {selectedTheme === t.id && (
                <div style={{ fontSize: 10, color: 'var(--amber)', marginTop: 3 }}>✓ مفعّل</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── معلومات المستخدم ── */}
      <div className="card blue">
        <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 16, fontSize: 13.5 }}>
          👤 معلومات المستخدم والمشروع
        </div>
        <div className="g2">
          <div className="inp-g">
            <label>اسم الطالب</label>
            <input value={userInfo.studentName} onChange={e => upd('studentName', e.target.value)} placeholder="أحمد بشار عقيل" />
          </div>
          <div className="inp-g">
            <label>لقب الطالب</label>
            <select value={userInfo.studentTitle} onChange={e => upd('studentTitle', e.target.value)}>
              {['طالب', 'م. — مهندس', 'باحث', 'م.م. — مدرس مساعد', 'م. — مدرس'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="inp-g">
            <label>اسم المشرف</label>
            <input value={userInfo.supervisor} onChange={e => upd('supervisor', e.target.value)} placeholder="اسم المشرف الأكاديمي" />
          </div>
          <div className="inp-g">
            <label>اللقب العلمي للمشرف</label>
            <select value={userInfo.supervisorTitle} onChange={e => upd('supervisorTitle', e.target.value)}>
              {['م. — مدرس', 'م.م. — مدرس مساعد', 'أ.م. — أستاذ مساعد', 'أ.م.د — أستاذ مساعد دكتور', 'أ.د. — أستاذ دكتور'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="inp-g">
            <label>الجامعة</label>
            <input value={userInfo.university} onChange={e => upd('university', e.target.value)} placeholder="جامعة القادسية" />
          </div>
          <div className="inp-g">
            <label>الكلية</label>
            <input value={userInfo.college} onChange={e => upd('college', e.target.value)} placeholder="كلية الهندسة" />
          </div>
          <div className="inp-g">
            <label>القسم</label>
            <input value={userInfo.dept} onChange={e => upd('dept', e.target.value)} placeholder="قسم الهندسة الكيمياوية" />
          </div>
        </div>
        <button className="btn btn-blue" onClick={saveUserInfo}>💾 حفظ المعلومات</button>
      </div>

      {/* ── معلومات النظام ── */}
      <div className="card purple">
        <div style={{ fontWeight: 800, color: 'var(--purple)', marginBottom: 14, fontSize: 13.5 }}>
          ℹ️ معلومات النظام
        </div>
        {[
          ['الإصدار',  'v3.0.0'],
          ['التقنية',  'React 18 + Vite'],
          ['الجامعة',  userInfo.university || 'جامعة القادسية'],
          ['الكلية',   userInfo.college    || 'كلية الهندسة'],
          ['القسم',    userInfo.dept       || 'قسم الهندسة الكيمياوية'],
          ['البيانات', 'LocalStorage (Offline)'],
        ].map(([l, v]) => (
          <div key={l} className="rr">
            <span className="rl">{l}</span>
            <span className="rv" style={{ fontSize: 12, color: 'var(--text2)' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* ── إدارة البيانات ── */}
      <div className="card green">
        <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 16, fontSize: 13.5 }}>
          💾 إدارة البيانات
        </div>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <button className="btn btn-green btn-sm" onClick={exportData}>📤 تصدير JSON</button>
          <button className="btn btn-blue btn-sm"  onClick={importData}>📥 استيراد JSON</button>
          <button className="btn btn-red btn-sm" onClick={() => {
            if (confirm('مسح كل بيانات النظام نهائياً؟')) { localStorage.clear(); window.location.reload() }
          }}>🗑️ مسح الكل</button>
        </div>
        <div className="info" style={{ marginTop: 12 }}>
          💡 البيانات محفوظة محلياً. صدّر نسخة احتياطية بانتظام.
        </div>
      </div>
    </div>
  )
}