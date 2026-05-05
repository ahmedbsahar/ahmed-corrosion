import useStore from '../store'
import { REFERENCE_DATA } from '../utils/corrosion'
import logo from '../assets/logo.png'

export default function Dashboard() {
  const { setActiveTab, savedData, steps, photos } = useStore()
  const done = steps.filter(Boolean).length

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '28px 0 18px', textAlign: 'center' }}>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(245,166,35,.08)',
          border: '1px solid rgba(245,166,35,.3)',
          color: 'var(--amber)', padding: '4px 16px',
          borderRadius: 99, fontSize: 10.5, fontWeight: 700, marginBottom: 16,
        }}>
          🔬 مشروع أحمد بشار عقيل — الهندسة الكيمياوية — v3.0
        </div>

        <h1 style={{
          fontSize: 'clamp(20px,4vw,44px)', fontWeight: 900,
          lineHeight: 1.2, marginBottom: 11,
          background: 'linear-gradient(135deg, var(--text) 0%, var(--amber) 45%, var(--green) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          دراسة التآكل وتطوير<br />الطلاء الواقي للمعادن
        </h1>

        <p style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.9, marginBottom: 22 }}>
          مشروع تطبيقي متكامل باستخدام الـ Micrometer بدقة 0.001mm<br />
          مع ذكاء اصطناعي لتحليل النتائج ورسوم بيانية تفاعلية
        </p>

        {/* Student Chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 13,
          background: 'linear-gradient(135deg,rgba(245,166,35,.1),rgba(0,200,150,.07))',
          border: '1.5px solid rgba(245,166,35,.35)',
          borderRadius: 16, padding: '13px 28px', marginBottom: 24,
          boxShadow: '0 0 35px rgba(245,166,35,.1)',
        }}>
          <img src={logo} style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 10 }} alt="logo" />
          <div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 2 }}>إعداد الطالب</div>
            <div style={{
              fontSize: 21, fontWeight: 900,
              background: 'linear-gradient(135deg, var(--amber), var(--green))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              أحمد بشار عقيل
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          {[
            ['3',               'معادن'],
            ['4',               'محاليل'],
            ['72h',             'مدة التجربة'],
            ['0.001',           'دقة mm'],
            [savedData.length,  'قياسات'],
            [`${done}/8`,       'خطوات'],
          ].map(([v, l]) => (
            <div key={l} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 11, padding: '11px 16px', textAlign: 'center',
              transition: 'all .18s', cursor: 'default', minWidth: 75,
            }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--amber)' }}>{v}</div>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Widgets */}
      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 18 }}>
        {[
          ['🧮', '8.03',         'أعلى CR (mm/yr)',    'var(--amber)',  'calc'],
          ['🛡️', '95%',          'فعالية الإيبوكسي',  'var(--green)',  'compare'],
          ['🏆', 'Cu',           'أفضل مقاومة',        'var(--purple)', 'results'],
          ['📸', photos.length,  'صور مرفوعة',         'var(--cyan)',   'photos'],
          ['✅', `${done}/8`,    'خطوات منجزة',        'var(--blue)',   'steps'],
        ].map(([icon, val, lbl, clr, tab]) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, minWidth: 120,
              background: 'var(--card2)',
              border: '1px solid var(--border)',
              borderRadius: 11, padding: '13px 15px',
              transition: 'all .18s', cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 7 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: clr }}>{val}</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 4 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
        {[
          ['🧮', 'احسب معدل التآكل', 'calc'],
          ['🤖', 'تحليل ذكي',        'ai'],
          ['📊', 'الرسوم البيانية',  'charts'],
          ['⏱️', 'المؤقت',           'timer'],
          ['📄', 'التقرير',          'report'],
          ['🔩', 'الميكروميتر',      'micrometer'],
        ].map(([icon, label, tab]) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 14px',
              background: 'var(--card2)',
              border: '1px solid var(--border)',
              borderRadius: 11, cursor: 'pointer',
              transition: 'all .18s',
              fontSize: 11.5, fontWeight: 600, color: 'var(--muted)',
            }}
          >
            {icon} {label}
          </div>
        ))}
      </div>

      {/* Cards Row */}
      <div className="g2">

        {/* Project Map */}
        <div className="card amber">
          <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
            📈 خريطة المشروع
          </div>
          <div style={{ overflowX: 'auto', paddingBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
              {['تحضير', 'قياس T₀', 'تغمير', 'قياس', 'تحليل', 'تقرير'].map((s, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '8px 12px' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `hsl(${i * 45}, 80%, 55%)`,
                      color: '#000', fontWeight: 900, fontSize: 13,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 5px',
                    }}>{i + 1}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 20, height: 2, background: 'linear-gradient(90deg,var(--amber),var(--green))' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="card green">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 13.5 }}>✅ تقدم الخطوات</div>
            <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>{done} / 8</span>
          </div>
          <div className="prog">
            <div className="prog-bar" style={{ width: `${(done / 8) * 100}%` }} />
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', lineHeight: 2.2 }}>
            <div>🧮 <span style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => setActiveTab('calc')}>ابدأ بإدخال قياسات الميكروميتر</span></div>
            <div>📊 <span style={{ color: 'var(--purple)', cursor: 'pointer' }} onClick={() => setActiveTab('charts')}>شاهد الرسوم البيانية التفاعلية</span></div>
            <div>🤖 <span style={{ color: 'var(--amber)', cursor: 'pointer' }} onClick={() => setActiveTab('ai')}>احصل على تحليل ذكي لنتائجك</span></div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="formula">
        <div className="f">CR (mm/year) = (T₀ − Tₙ) ÷ t × 8760</div>
        <div className="fd">T₀ = السُمك الأولي | Tₙ = السُمك النهائي | t = الزمن (ساعات) | 8760 = ساعات السنة</div>
      </div>
    </div>
  )
}