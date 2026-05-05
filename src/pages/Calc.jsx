import { useState, useMemo } from 'react'
import useStore from '../store'
import { METALS, SOLUTIONS, COATINGS, calcCR, classifyCR } from '../utils/corrosion'

export default function Calc() {
  const { savedData, addData, clearData, notify } = useStore()

  const [form, setForm] = useState({
    metal: 'fe', sol: 'hcl', coat: 'none', t0: '', tn: '', time: '72'
  })
  const [avgs, setAvgs]     = useState(['', '', '', '', ''])
  const [result, setResult] = useState(null)

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const calcAvg = () => {
    const vals = avgs.map(Number).filter(v => !isNaN(v) && v > 0)
    if (!vals.length) { notify('أدخل قيمة واحدة على الأقل', 'warn'); return }
    const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3)
    setForm(f => ({ ...f, t0: avg }))
    notify('⌀ المتوسط: ' + avg + ' mm')
  }

  const calc = () => {
    const t0 = +form.t0, tn = +form.tn, t = +form.time
    if (!t0 || !tn) { notify('أدخل قيم السُمك', 'warn'); return }
    if (tn > t0)    { notify('⚠️ السُمك النهائي أكبر من الأولي!', 'warn'); return }
    const res = calcCR(t0, tn, t)
    if (!res) { notify('خطأ في الحساب', 'err'); return }
    const cls = classifyCR(res.cr)
    setResult({ ...res, ...cls, t0, tn })
    notify('✅ CR = ' + res.cr + ' mm/year')
  }

  const save = () => {
    if (!result) { notify('احسب أولاً!', 'warn'); return }
    addData({
      metal: METALS[form.metal],
      sol:   SOLUTIONS[form.sol].split(' ')[0],
      coat:  COATINGS[form.coat],
      t0:    result.t0,
      tn:    result.tn,
      delta: result.delta,
      cr:    result.cr,
      cls:   result.label,
      clr:   result.color,
    })
    notify('💾 تم الحفظ!')
  }

  const exportCSV = () => {
    if (!savedData.length) { notify('لا توجد بيانات', 'warn'); return }
    let csv = '\uFEFF#,المعدن,المحلول,الطلاء,T0,Tn,ΔT,CR,التصنيف\n'
    savedData.forEach((d, i) => {
      csv += `${i + 1},${d.metal},${d.sol},${d.coat},${d.t0},${d.tn},${d.delta},${d.cr},${d.cls}\n`
    })
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'corrosion_data.csv'
    a.click()
    notify('📤 تم تصدير CSV')
  }

  const stats = useMemo(() => {
    if (!savedData.length) return null
    const crs  = savedData.map(d => +d.cr)
    const mean = crs.reduce((a, b) => a + b, 0) / crs.length
    const std  = Math.sqrt(crs.map(v => (v - mean) ** 2).reduce((a, b) => a + b, 0) / crs.length)
    return {
      mean: mean.toFixed(2),
      std:  std.toFixed(2),
      min:  Math.min(...crs).toFixed(2),
      max:  Math.max(...crs).toFixed(2),
    }
  }, [savedData])

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> التحليل <span>›</span> الحاسبة</div>
        <h2>حاسبة معدل التآكل</h2>
        <p>احسب معدل التآكل وصنّفه واحصل على توصيات علمية فورية</p>
      </div>

      {/* Calculator */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          🧮 إدخال البيانات
        </div>

        <div className="formula">
          <div className="f">CR (mm/year) = (T₀ − Tₙ) ÷ t × 8760</div>
        </div>

        <div className="g3">
          <div className="inp-g">
            <label>نوع المعدن</label>
            <select value={form.metal} onChange={e => upd('metal', e.target.value)}>
              {Object.entries(METALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="inp-g">
            <label>نوع المحلول</label>
            <select value={form.sol} onChange={e => upd('sol', e.target.value)}>
              {Object.entries(SOLUTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="inp-g">
            <label>الطلاء الواقي</label>
            <select value={form.coat} onChange={e => upd('coat', e.target.value)}>
              {Object.entries(COATINGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="inp-g">
            <label>T₀ — السُمك الأولي (mm)</label>
            <input
              type="number" placeholder="2.000" step="0.001"
              value={form.t0} onChange={e => upd('t0', e.target.value)}
            />
          </div>
          <div className="inp-g">
            <label>Tₙ — السُمك النهائي (mm)</label>
            <input
              type="number" placeholder="1.934" step="0.001"
              value={form.tn} onChange={e => upd('tn', e.target.value)}
            />
          </div>
          <div className="inp-g">
            <label>الزمن</label>
            <select value={form.time} onChange={e => upd('time', e.target.value)}>
              {['24', '48', '72', '168'].map(t => (
                <option key={t} value={t}>{t} ساعة</option>
              ))}
            </select>
          </div>
        </div>

        {/* Average Calculator */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, marginBottom: 7 }}>
            متوسط 5 قياسات (اختياري):
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {avgs.map((v, i) => (
              <input
                key={i}
                type="number"
                placeholder={`Q${i + 1}`}
                value={v}
                step="0.001"
                style={{
                  width: 65,
                  background: 'var(--card)',
                  border: '1px solid var(--border2)',
                  color: 'var(--text)',
                  padding: '7px 8px',
                  borderRadius: 8,
                  fontSize: 12,
                  outline: 'none',
                }}
                onChange={e => setAvgs(a => {
                  const n = [...a]; n[i] = e.target.value; return n
                })}
              />
            ))}
            <button className="btn btn-outline btn-sm" onClick={calcAvg}>⌀ متوسط</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <button className="btn btn-amber" onClick={calc}>⚡ احسب معدل التآكل</button>
          <button className="btn btn-green" onClick={save}>💾 حفظ في الجدول</button>
          <button className="btn btn-outline" onClick={() => { setForm(f => ({ ...f, t0: '', tn: '' })); setResult(null) }}>
            🗑️ مسح
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={{ marginTop: 18 }}>
            <div style={{ color: 'var(--amber)', fontWeight: 800, marginBottom: 12, fontSize: 14 }}>
              📊 نتائج الحساب
            </div>
            {[
              ['فقدان السُمك ΔT',          result.delta + ' mm',   'var(--text)'],
              ['معدل التآكل السنوي CR',     result.cr + ' mm/year', result.color],
              ['التصنيف الدولي',            result.label,           result.color],
              ['العمر التقديري (سُمك 10mm)', (9 / +result.cr).toFixed(1) + ' سنة', 'var(--blue)'],
            ].map(([l, v, c]) => (
              <div key={l} className="rr">
                <span className="rl">{l}</span>
                <span className="rv" style={{ color: c, fontSize: l.includes('CR') ? 17 : 13 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>
                <span>مستوى الخطورة</span>
                <span style={{ color: result.color, fontWeight: 700 }}>{result.pct}%</span>
              </div>
              <div className="prog">
                <div className="prog-bar" style={{
                  width: result.pct + '%',
                  background: `linear-gradient(90deg, #00c896, ${result.color})`,
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Data */}
      <div className="card green">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 13.5 }}>
            📋 البيانات المحفوظة
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <button className="btn btn-blue btn-sm" onClick={exportCSV}>📤 CSV</button>
            <button className="btn btn-red btn-sm" onClick={() => {
              if (confirm('مسح كل البيانات؟')) { clearData(); notify('🗑️ تم المسح') }
            }}>🗑️ مسح</button>
          </div>
        </div>

        {savedData.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
            لا توجد بيانات — احسب واضغط "حفظ"
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl" style={{ minWidth: 620 }}>
              <thead>
                <tr>
                  {['#', 'المعدن', 'المحلول', 'الطلاء', 'T₀', 'Tₙ', 'ΔT', 'CR (mm/yr)', 'التصنيف'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {savedData.map((d, i) => (
                  <tr key={d.id}>
                    <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                    <td><strong>{d.metal}</strong></td>
                    <td>{d.sol}</td>
                    <td>{d.coat}</td>
                    <td>{d.t0}</td>
                    <td>{d.tn}</td>
                    <td>{d.delta}</td>
                    <td style={{ color: d.clr, fontWeight: 700 }}>{d.cr}</td>
                    <td>
                      <span className="badge" style={{ background: d.clr + '22', color: d.clr }}>
                        {d.cls}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Auto Stats */}
      {stats && (
        <div className="card blue">
          <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
            📐 إحصاء تلقائي
          </div>
          <div className="g4">
            {[
              ['📊', stats.mean, 'متوسط CR',          '#3d8ef0'],
              ['📐', stats.std,  'الانحراف المعياري', '#9d6fff'],
              ['⬇️', stats.min,  'أدنى قيمة',         '#00c896'],
              ['⬆️', stats.max,  'أعلى قيمة',         '#ff4d6a'],
            ].map(([ic, v, l, c]) => (
              <div key={l} style={{ background: 'var(--card)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{ic}</div>
                <div style={{ fontSize: 19, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}