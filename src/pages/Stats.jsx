import { useState } from 'react'
import { calcStats } from '../utils/corrosion'
import useStore from '../store'

export default function Stats() {
  const { notify } = useStore()
  const [raw, setRaw] = useState('')
  const [res, setRes] = useState(null)

  const run = () => {
    const vals = raw.split(/[,،\s]+/).map(Number).filter(v => !isNaN(v) && v !== 0)
    if (vals.length < 2) { notify('أدخل قيمتين على الأقل', 'warn'); return }
    setRes(calcStats(vals))
    notify('📐 اكتمل التحليل الإحصائي')
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> التحليل <span>›</span> الإحصاء</div>
        <h2>التحليل الإحصائي</h2>
        <p>متوسط، انحراف معياري، خطأ القياس، ونطاق الثقة 95%</p>
      </div>

      {/* Input */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          📐 أدخل قياساتك للتحليل
        </div>
        <div className="inp-g">
          <label>القيم مفصولة بفواصل (مثال: 2.001, 1.998, 2.003, 2.000, 1.999)</label>
          <textarea
            value={raw}
            onChange={e => setRaw(e.target.value)}
            placeholder="2.001, 1.998, 2.003, 2.000, 1.999, 2.002, 1.997"
            rows={3}
          />
        </div>
        <button className="btn btn-amber" onClick={run}>
          📐 تحليل إحصائي كامل
        </button>

        {/* Results */}
        {res && (
          <div style={{ marginTop: 18 }}>
            <div className="g2">
              {[
                ['عدد القياسات',       res.n,              'var(--text)'],
                ['المتوسط (Mean)',      res.mean + ' mm',   'var(--amber)'],
                ['الانحراف المعياري SD',res.std  + ' mm',   'var(--blue)'],
                ['الخطأ القياسي SEM',  res.sem  + ' mm',   'var(--purple)'],
                ['أدنى قيمة',          res.min  + ' mm',   'var(--green)'],
                ['أعلى قيمة',          res.max  + ' mm',   'var(--red)'],
                ['المدى (Range)',       res.range + ' mm',  'var(--text)'],
                ['معامل الاختلاف CV',  res.cv   + '%',     'var(--orange)'],
              ].map(([l, v, c]) => (
                <div key={l} className="rr">
                  <span className="rl">{l}</span>
                  <span className="rv" style={{ color: c }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Quality */}
            <div className="rr" style={{ marginTop: 8 }}>
              <span className="rl">جودة القياس</span>
              <span className="rv" style={{ fontSize: 15 }}>{res.quality}</span>
            </div>

            {/* Report */}
            <div style={{
              marginTop: 12, padding: '12px 14px',
              background: 'var(--card)', borderRadius: 10,
              fontSize: 12, color: 'var(--muted)', lineHeight: 1.9,
            }}>
              <strong style={{ color: 'var(--amber)' }}>التقرير الإحصائي:</strong><br />
              المتوسط = {res.mean} ± {res.std} mm (n={res.n})<br />
              نطاق الثقة 95%: {res.ci95l} — {res.ci95h} mm
            </div>
          </div>
        )}
      </div>

      {/* Quality Standards */}
      <div className="card blue">
        <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
          📖 معايير جودة القياس
        </div>
        <div className="g3">
          {[
            ['✅ ممتاز',        '#00c896', 'rgba(0,200,150,.3)',  'SD أقل من ±0.002mm — دقة قياس عالية جداً'],
            ['⚠️ مقبول',       '#f5a623', 'rgba(245,166,35,.3)', 'SD بين ±0.002 و±0.005mm — دقة جيدة'],
            ['❌ أعد القياس',   '#ff4d6a', 'rgba(255,77,106,.3)', 'SD أكبر من ±0.005mm — خطأ كبير في القياس'],
          ].map(([l, c, bc, d]) => (
            <div key={l} style={{
              background: 'var(--card)', borderRadius: 11,
              padding: 14, border: `1px solid ${bc}`,
            }}>
              <div style={{ color: c, fontWeight: 700, marginBottom: 6, fontSize: 13 }}>{l}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="card green">
        <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 14, fontSize: 13.5 }}>
          📚 المعادلات الإحصائية المستخدمة
        </div>
        <div className="g2">
          {[
            ['المتوسط الحسابي',      'x̄ = Σxᵢ / n'],
            ['الانحراف المعياري',    's = √[Σ(xᵢ-x̄)² / (n-1)]'],
            ['الخطأ القياسي',        'SEM = s / √n'],
            ['نطاق الثقة 95%',       'x̄ ± 1.96 × SEM'],
          ].map(([name, formula]) => (
            <div key={name} style={{
              background: 'var(--card)', borderRadius: 10,
              padding: '12px 14px', border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{name}</div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 13,
                color: 'var(--amber)', direction: 'ltr',
              }}>{formula}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}