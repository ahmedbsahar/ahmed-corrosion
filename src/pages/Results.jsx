import { REFERENCE_DATA } from '../utils/corrosion'

export default function Results() {
  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> التحليل <span>›</span> النتائج</div>
        <h2>النتائج التجريبية</h2>
        <p>جدول النتائج الكاملة مع التصنيف الدولي والاستنتاجات</p>
      </div>

      {/* Results Table */}
      <div className="card red">
        <div style={{ fontWeight: 800, color: 'var(--red)', marginBottom: 14, fontSize: 13.5 }}>
          📊 جدول النتائج التجريبية
        </div>
        <div className="tbl-wrap">
          <table className="tbl" style={{ minWidth: 600 }}>
            <thead>
              <tr>
                {['المعدن', 'المحلول', 'T₀ (mm)', 'T₇₂ (mm)', 'ΔT (mm)', 'CR (mm/yr)', 'التصنيف'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REFERENCE_DATA.map((d, i) => {
                const delta = (d.t0 - d.tn).toFixed(3)
                const cls   = d.cr >= 10 ? 'شديد جداً' : d.cr >= 5 ? 'شديد' : d.cr >= 2 ? 'متوسط' : 'خفيف'
                return (
                  <tr key={i}>
                    <td><strong>{d.metal}</strong></td>
                    <td>{d.sol}</td>
                    <td>{d.t0.toFixed(3)}</td>
                    <td>{d.tn.toFixed(3)}</td>
                    <td>{delta}</td>
                    <td style={{ color: d.color, fontWeight: 700, fontSize: 13.5 }}>{d.cr}</td>
                    <td>
                      <span className="badge" style={{ background: d.color + '22', color: d.color }}>
                        {cls}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classification */}
      <div className="card blue">
        <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
          🌍 معايير التصنيف الدولي للتآكل
        </div>
        <div className="g4">
          {[
            ['خفيف',       '#00c896', '<2 mm/yr',    'مقبول صناعياً\nلا يحتاج طلاء'],
            ['متوسط',      '#f5a623', '2–5 mm/yr',   'يحتاج مراقبة\nيُنصح بطلاء'],
            ['شديد',       '#ff7a35', '5–10 mm/yr',  'خطر\nإيبوكسي إلزامي'],
            ['شديد جداً',  '#ff4d6a', '>10 mm/yr',   'غير مقبول\nغيّر المعدن'],
          ].map(([l, c, r, d]) => (
            <div key={l} style={{
              background: 'var(--card)', borderRadius: 11,
              padding: '13px 10px', textAlign: 'center',
              border: `1px solid ${c}66`,
              background: c + '11',
            }}>
              <div style={{ color: c, fontWeight: 800, fontSize: 14, marginBottom: 5 }}>{l}</div>
              <div style={{ color: c, fontWeight: 700, fontSize: 12, marginBottom: 5 }}>{r}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', whiteSpace: 'pre-line' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusions */}
      <div className="card green">
        <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 14, fontSize: 13.5 }}>
          🏆 الاستنتاجات والتوصيات
        </div>
        <div className="g2">
          {[
            ['var(--red)',    '❌ الحديد في HCl — الأسوأ',
              'أعلى معدل تآكل 8.03 mm/yr — يجب تجنّبه تماماً في البيئات الحمضية'],
            ['var(--green)',  '✅ النحاس في NaCl — الأفضل',
              'أقل معدل تآكل 1.34 mm/yr — مناسب للاستخدام البحري وشبكات المياه'],
            ['var(--amber)',  '⚠️ الألمنيوم — تحذير',
              'حساس للأحماض والقواعد معاً. مناسب فقط للبيئات المحايدة'],
            ['var(--green)',  '🏆 الإيبوكسي — أفضل طلاء',
              'يقلل التآكل بنسبة 95%. موصى به بشدة للتطبيقات الصناعية'],
          ].map(([c, t, d]) => (
            <div key={t} style={{
              background: 'var(--card)', borderRadius: 11,
              padding: '13px 15px',
              border: `1px solid ${c}44`,
              transition: 'all .18s',
            }}>
              <div style={{ color: c, fontWeight: 700, fontSize: 12.5, marginBottom: 5 }}>{t}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Metals Ranking */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          🥇 ترتيب المعادن من الأكثر مقاومة للتآكل
        </div>
        {[
          ['🥇', 'نحاس (Cu)',     '1.34 mm/yr في NaCl',  'var(--amber)', 'الأفضل — مقاوم في البيئات البحرية'],
          ['🥈', 'ألمنيوم (Al)', '2.8 mm/yr في NaCl',   'var(--muted)', 'جيد — لكن حساس للأحماض والقواعد'],
          ['🥉', 'حديد (Fe)',     '8.03 mm/yr في HCl',   'var(--red)',   'الأسوأ — يحتاج حماية دائمة'],
        ].map(([medal, name, cr, c, note]) => (
          <div key={name} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 14px', background: 'var(--card)',
            borderRadius: 11, marginBottom: 8,
            border: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 28 }}>{medal}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: c, fontSize: 13 }}>{name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{note}</div>
            </div>
            <span className="badge" style={{ background: c + '22', color: c }}>{cr}</span>
          </div>
        ))}
      </div>
    </div>
  )
}