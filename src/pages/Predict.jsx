import { useState, useEffect, useRef } from 'react'
import { calcLifetime } from '../utils/corrosion'
import useStore from '../store'

export default function Predict() {
  const { notify } = useStore()
  const [form, setForm] = useState({ t0: '10', cr: '5.48', minT: '1' })
  const [res, setRes]   = useState(null)
  const chartRef        = useRef(null)
  const upd = (k, v)   => setForm(f => ({ ...f, [k]: v }))

  const drawChart = (t0, cr, minT) => {
    const canvas = document.getElementById('chart-predict')
    if (!canvas || !window.Chart) return
    if (chartRef.current) chartRef.current.destroy()

    const isDark    = document.documentElement.dataset.theme !== 'light'
    const textColor = isDark ? '#5c7099' : '#475569'
    const gridColor = isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'

    const years = Array.from({ length: 11 }, (_, i) => i)
    const data  = years.map(y => Math.max(+minT, +t0 - +cr * y).toFixed(3))

    chartRef.current = new window.Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: years.map(y => y + ' yr'),
        datasets: [{
          label: 'السُمك (mm)',
          data,
          borderColor: '#f5a623',
          backgroundColor: 'rgba(245,166,35,.08)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#f5a623',
          pointRadius: 5,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: textColor } },
          tooltip: { callbacks: { label: c => c.raw + ' mm' } },
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } },
        },
      },
    })
  }

  const calc = () => {
    const t0 = +form.t0, cr = +form.cr, minT = +form.minT
    if (!t0 || !cr) { notify('أدخل القيم', 'warn'); return }
    const result = calcLifetime(t0, minT, cr)
    setRes(result)
    drawChart(t0, cr, minT)
    notify('🔮 العمر المتوقع: ' + result.life + ' سنة')
  }

  useEffect(() => {
    drawChart(+form.t0, +form.cr, +form.minT)
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [])

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> الذكاء الاصطناعي <span>›</span> التنبؤ</div>
        <h2>التنبؤ وتقدير عمر المادة</h2>
        <p>توقع التآكل المستقبلي وتقدير عمر المعدن بناءً على CR</p>
      </div>

      {/* Input */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          🔮 تقدير عمر المادة
        </div>
        <div className="g3">
          <div className="inp-g">
            <label>السُمك الأولي (mm)</label>
            <input
              type="number" value={form.t0} step="0.1"
              onChange={e => upd('t0', e.target.value)}
            />
          </div>
          <div className="inp-g">
            <label>معدل التآكل CR (mm/yr)</label>
            <input
              type="number" value={form.cr} step="0.01"
              onChange={e => upd('cr', e.target.value)}
            />
          </div>
          <div className="inp-g">
            <label>السُمك الأدنى المقبول (mm)</label>
            <input
              type="number" value={form.minT} step="0.1"
              onChange={e => upd('minT', e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-amber" onClick={calc}>
          🔮 احسب العمر المتوقع
        </button>

        {res && (
          <div style={{ marginTop: 16 }}>
            {[
              ['العمر الكلي المتوقع',      res.life + ' سنة',     'var(--amber)', 18],
              ['حتى نصف العمر',            res.halfLife + ' سنة', 'var(--blue)',  14],
              ['فقدان السُمك بعد 5 سنوات', res.loss5 + ' mm',     'var(--orange)',14],
              ['فقدان السُمك بعد 10 سنوات',res.loss10 + ' mm',    'var(--red)',   14],
            ].map(([l, v, c, fs]) => (
              <div key={l} className="rr">
                <span className="rl">{l}</span>
                <span className="rv" style={{ color: c, fontSize: fs }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="card blue">
        <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
          📈 توقع التآكل خلال 10 سنوات
        </div>
        <canvas id="chart-predict" height={220} />
      </div>

      {/* Maintenance Recommendations */}
      <div className="card green">
        <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 14, fontSize: 13.5 }}>
          🔧 توصيات الصيانة الذكية
        </div>
        {!res ? (
          <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
            أدخل البيانات أعلاه للحصول على توصيات مخصصة
          </div>
        ) : (
          (() => {
            const cr = +form.cr
            const recs = cr < 2 ? [
              '✅ المعدن مناسب للاستخدام طويل الأمد بدون طلاء إضافي',
              '🔍 فحص دوري كل 5 سنوات كافٍ',
              '📊 لا حاجة لتدخل فوري — استمر في المراقبة',
            ] : cr < 5 ? [
              '⚠️ يُنصح بتطبيق طلاء إيبوكسي لتمديد العمر',
              '🔍 فحص دوري كل سنتين',
              '💊 إضافة مثبطات تآكل للمحلول إن أمكن',
              '📋 توثيق التغيرات في السُمك بانتظام',
            ] : [
              '🔴 استبدال المعدن مطلوب قريباً',
              '🛡️ تطبيق إيبوكسي سميك فوري (طبقتان على الأقل)',
              '🔍 فحص شهري إلزامي',
              '🔄 النظر في تغيير نوع المعدن كلياً',
              '⚠️ لا تستخدم في التطبيقات الحرجة بدون حماية',
            ]
            return recs.map((r, i) => (
              <div key={i} style={{
                padding: '10px 14px',
                background: 'var(--card)',
                borderRadius: 10,
                marginBottom: 8,
                fontSize: 13,
                color: 'var(--text2)',
              }}>
                {r}
              </div>
            ))
          })()
        )}
      </div>

      {/* Formula */}
      <div className="formula">
        <div className="f">Lifetime = (T₀ − T_min) ÷ CR</div>
        <div className="fd">
          T₀ = السُمك الأولي | T_min = السُمك الأدنى المقبول | CR = معدل التآكل السنوي
        </div>
      </div>
    </div>
  )
}