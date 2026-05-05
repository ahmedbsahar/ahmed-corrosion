import { useState } from 'react'
import useStore from '../store'
import { METALS } from '../utils/corrosion'

export default function Micrometer() {
  const { addMicroLog, microLog, clearMicroLog, notify } = useStore()
  const [val, setVal] = useState(2000)
  const [metal, setMetal] = useState('fe')
  const [mtype, setMtype] = useState('T₀ - أولي')

  const reading = (val / 1000).toFixed(3)

  const adjust = (delta) => {
    setVal(v => Math.max(0, Math.min(25000, v + delta)))
  }

  const save = () => {
    addMicroLog({
      val: reading,
      metal: METALS[metal],
      type: mtype,
      time: new Date().toLocaleTimeString('ar'),
    })
    notify('💾 تم حفظ: ' + reading + ' mm')
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> التجربة <span>›</span> الميكروميتر</div>
        <h2>محاكي الميكروميتر</h2>
        <p>تدرّب على قراءة وتسجيل قيم الميكروميتر بدقة 0.001mm</p>
      </div>

      <div className="g2">

        {/* Simulator */}
        <div className="card amber">
          <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 16, fontSize: 13.5 }}>
            🔩 محاكاة الميكروميتر
          </div>

          <div style={{ textAlign: 'center', padding: '10px 0' }}>

            {/* Reading Display */}
            <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>
              القراءة الحالية
            </div>
            <div style={{
              fontSize: 42, fontWeight: 900,
              fontFamily: 'var(--mono)',
              color: 'var(--amber)',
              letterSpacing: 4,
              textShadow: '0 0 30px rgba(245,166,35,.35)',
              marginBottom: 4,
            }}>
              {reading}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>mm</div>

            {/* Slider */}
            <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)' }}>
              <span>0.000 mm</span>
              <span>25.000 mm</span>
            </div>
            <input
              type="range"
              min={0} max={25000} value={val} step={1}
              style={{ width: '100%', accentColor: 'var(--amber)', marginBottom: 16 }}
              onChange={e => setVal(Number(e.target.value))}
            />

            {/* Adjust Buttons */}
            <div style={{ display: 'flex', gap: 7, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              {[
                [-100, '−0.100'],
                [-10,  '−0.010'],
                [-1,   '−0.001'],
                [1,    '+0.001'],
                [10,   '+0.010'],
                [100,  '+0.100'],
              ].map(([d, l]) => (
                <button key={l} className="btn btn-outline btn-sm" onClick={() => adjust(d)}>
                  {l}
                </button>
              ))}
            </div>

            {/* Metal & Type */}
            <div className="g2" style={{ textAlign: 'right' }}>
              <div className="inp-g">
                <label>المعدن</label>
                <select value={metal} onChange={e => setMetal(e.target.value)}>
                  {Object.entries(METALS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="inp-g">
                <label>نوع القياس</label>
                <select value={mtype} onChange={e => setMtype(e.target.value)}>
                  {['T₀ - أولي', 'T₂₄ - 24h', 'T₄₈ - 48h', 'T₇₂ - 72h'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn btn-amber btn-full" onClick={save}>
              💾 حفظ القراءة
            </button>
          </div>
        </div>

        {/* Log */}
        <div className="card green">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 14,
          }}>
            <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 13.5 }}>
              📋 سجل القراءات
            </div>
            {microLog.length > 0 && (
              <button className="btn btn-red btn-sm" onClick={() => { clearMicroLog(); notify('🗑️ تم المسح') }}>
                🗑️ مسح
              </button>
            )}
          </div>

          {microLog.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 20, fontSize: 12 }}>
              لا توجد قراءات بعد
            </div>
          ) : (
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {microLog.map((e, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '7px 9px',
                  background: 'var(--card2)',
                  borderRadius: 8, marginBottom: 6, fontSize: 12,
                }}>
                  <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{e.val} mm</span>
                  <span style={{ color: 'var(--muted)' }}>{e.metal} — {e.type}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 10 }}>{e.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {microLog.length >= 2 && (
            <div style={{
              marginTop: 12, padding: '10px 12px',
              background: 'var(--card)', borderRadius: 9,
              fontSize: 12,
            }}>
              <div style={{ color: 'var(--muted)', marginBottom: 6 }}>إحصاء سريع:</div>
              {(() => {
                const vals = microLog.map(e => parseFloat(e.val))
                const mean = vals.reduce((a, b) => a + b, 0) / vals.length
                const min  = Math.min(...vals)
                const max  = Math.max(...vals)
                return (
                  <>
                    <div className="rr">
                      <span className="rl">المتوسط</span>
                      <span className="rv" style={{ color: 'var(--amber)' }}>{mean.toFixed(3)} mm</span>
                    </div>
                    <div className="rr">
                      <span className="rl">الأدنى</span>
                      <span className="rv" style={{ color: 'var(--green)' }}>{min.toFixed(3)} mm</span>
                    </div>
                    <div className="rr">
                      <span className="rl">الأعلى</span>
                      <span className="rv" style={{ color: 'var(--red)' }}>{max.toFixed(3)} mm</span>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Guide */}
      <div className="card blue">
        <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
          📖 دليل قراءة الميكروميتر
        </div>
        <div className="g3">
          {[
            ['① Sleeve (الثابتة)', 'var(--blue)',
              'قراءة mm الكاملة على المقياس العلوي، و0.5mm من المقياس السفلي.',
              'مثال: 5.0 mm'],
            ['② Thimble (الدوارة)', 'var(--green)',
              'خطوط عمودية. كل خط = 0.01mm. اضرب في 0.01 للحصول على القيمة.',
              'مثال: 88 × 0.01 = 0.88mm'],
            ['③ القراءة الكلية', 'var(--amber)',
              'اجمع القيمتين. خذ 5 قراءات وأوجد المتوسط للحصول على دقة أعلى.',
              '5.0 + 0.88 = 5.88mm ✓'],
          ].map(([title, clr, desc, ex]) => (
            <div key={title} style={{
              background: 'var(--card)', borderRadius: 11,
              padding: 14, border: '1px solid var(--border)',
            }}>
              <div style={{ fontWeight: 700, color: clr, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 8 }}>{desc}</div>
              <div style={{ fontSize: 12, color: clr, fontWeight: 700, fontFamily: 'var(--mono)' }}>{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info">
        💡 <strong style={{ color: 'var(--amber)' }}>نصيحة:</strong> خذ دائماً 5 قراءات في نقاط مختلفة
        من العينة وأوجد المتوسط. هذا يقلل خطأ القياس ويزيد دقة النتائج.
      </div>
    </div>
  )
}