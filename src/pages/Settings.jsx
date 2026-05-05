import useStore from '../store'

export default function Settings() {
  const { theme, setTheme, notify } = useStore()

  const setColor = (name) => {
    document.documentElement.dataset.color = name === 'amber' ? '' : name
    localStorage.setItem('accentColor', name)
    notify('🎨 تم تغيير اللون')
  }

  const exportData = () => {
    const data = {
      savedData: JSON.parse(localStorage.getItem('savedData') || '[]'),
      steps:     JSON.parse(localStorage.getItem('steps')     || '[]'),
      theme:     localStorage.getItem('theme'),
      timestamp: new Date().toISOString(),
      project:   'مشروع أحمد بشار عقيل v3.0',
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
          if (d.savedData) localStorage.setItem('savedData', JSON.stringify(d.savedData))
          if (d.steps)     localStorage.setItem('steps',     JSON.stringify(d.steps))
          notify('📥 تم استيراد البيانات — أعد تحميل الصفحة')
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
        <p>تخصيص المظهر واللغة وإدارة البيانات</p>
      </div>

      {/* Appearance */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 16, fontSize: 13.5 }}>
          🎨 المظهر والألوان
        </div>

        {/* Theme Toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 14px', background: 'var(--card)',
          borderRadius: 9, border: '1px solid var(--border)', marginBottom: 8,
        }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>الوضع المظلم / الفاتح</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 2 }}>Ctrl+D</div>
          </div>
          <label style={{ position: 'relative', width: 38, height: 21, display: 'inline-block' }}>
            <input
              type="checkbox"
              checked={theme === 'light'}
              onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', inset: 0, cursor: 'pointer',
              background: theme === 'light' ? 'var(--amber)' : 'var(--border)',
              borderRadius: 99, transition: '.3s',
            }}>
              <span style={{
                position: 'absolute',
                height: 15, width: 15,
                left: theme === 'light' ? 20 : 3,
                bottom: 3,
                background: '#fff', borderRadius: '50%',
                transition: '.3s',
              }} />
            </span>
          </label>
        </div>

        {/* Colors */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 9, fontWeight: 700 }}>
            لون الثيم الرئيسي:
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              ['#f5a623', 'amber',  'برتقالي'],
              ['#00c896', 'green',  'أخضر'],
              ['#3d8ef0', 'blue',   'أزرق'],
              ['#9d6fff', 'purple', 'بنفسجي'],
              ['#22d3ee', 'cyan',   'سماوي'],
            ].map(([clr, name, label]) => (
              <div
                key={name}
                onClick={() => setColor(name)}
                title={label}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: clr, cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: '.2s',
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.2)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="card blue">
        <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 16, fontSize: 13.5 }}>
          👤 معلومات المستخدم
        </div>
        <div className="g2">
          <div className="inp-g">
            <label>اسم الطالب (ثابت)</label>
            <input value="أحمد بشار عقيل" readOnly style={{ opacity: .6, cursor: 'not-allowed' }} />
          </div>
          <div className="inp-g">
            <label>اللقب الأكاديمي</label>
            <select style={{
              width: '100%', background: 'var(--card)',
              border: '1px solid var(--border2)', color: 'var(--text)',
              padding: '9px 13px', borderRadius: 10,
              fontSize: 13, outline: 'none',
            }}>
              {[
                'طالب', 'م. — مهندس', 'م.م. — مدرس مساعد',
                'م. — مدرس', 'أ.م. — أستاذ مساعد',
                'أ.م.د — أستاذ مساعد دكتور', 'أ.د. — أستاذ دكتور', 'باحث',
              ].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="inp-g">
            <label>اسم المشرف</label>
            <input
              id="supervisor"
              placeholder="اسم المشرف الأكاديمي"
              defaultValue={localStorage.getItem('supervisor') || ''}
            />
          </div>
          <div className="inp-g">
            <label>الجامعة / الكلية</label>
            <input
              id="university"
              placeholder="كلية الهندسة — قسم الهندسة الكيمياوية"
              defaultValue={localStorage.getItem('university') || ''}
            />
          </div>
        </div>
        <button
          className="btn btn-blue btn-sm"
          onClick={() => {
            localStorage.setItem('supervisor', document.getElementById('supervisor').value)
            localStorage.setItem('university', document.getElementById('university').value)
            notify('✅ تم حفظ المعلومات')
          }}
        >
          💾 حفظ المعلومات
        </button>
      </div>

      {/* Data Management */}
      <div className="card green">
        <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 16, fontSize: 13.5 }}>
          💾 إدارة البيانات
        </div>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <button className="btn btn-green btn-sm" onClick={exportData}>📤 تصدير JSON</button>
          <button className="btn btn-blue btn-sm"  onClick={importData}>📥 استيراد JSON</button>
          <button
            className="btn btn-red btn-sm"
            onClick={() => {
              if (confirm('مسح كل بيانات النظام نهائياً؟')) {
                localStorage.clear()
                window.location.reload()
              }
            }}
          >
            🗑️ مسح الكل
          </button>
        </div>
        <div className="info" style={{ marginTop: 12 }}>
          💡 البيانات محفوظة محلياً على جهازك. صدّر نسخة احتياطية بانتظام.
        </div>
      </div>

      {/* System Info */}
      <div className="card purple">
        <div style={{ fontWeight: 800, color: 'var(--purple)', marginBottom: 14, fontSize: 13.5 }}>
          ℹ️ معلومات النظام
        </div>
        {[
          ['الإصدار',          'v3.0.0'],
          ['التقنية',          'React 18 + Vite'],
          ['المطور',           'أحمد بشار عقيل'],
          ['القسم',            'الهندسة الكيمياوية'],
          ['البيانات',         'LocalStorage (Offline)'],
          ['الرسوم البيانية',  'Chart.js v4'],
        ].map(([l, v]) => (
          <div key={l} className="rr">
            <span className="rl">{l}</span>
            <span className="rv" style={{ fontSize: 12, color: 'var(--text2)' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}