import { useState, useEffect, useRef } from 'react'
import { COATING_DATA, calcProtection } from '../utils/corrosion'
import useStore from '../store'

export default function Compare() {
  const { notify } = useStore()
  const [base, setBase]         = useState('')
  const [coated, setCoated]     = useState('')
  const [protResult, setProtResult] = useState(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const canvas = document.getElementById('chart-compare')
    if (!canvas) return
    if (chartRef.current) chartRef.current.destroy()

    const isDark = document.documentElement.dataset.theme !== 'light'
    const textColor = isDark ? '#5c7099' : '#475569'
    const gridColor = isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'

    chartRef.current = new window.Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: COATING_DATA.map(d => d.name),
        datasets: [{
          label: 'CR (mm/yr)',
          data: COATING_DATA.map(d => d.cr),
          backgroundColor: COATING_DATA.map(d => d.color),
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: c => `${c.raw} mm/yr`,
              afterLabel: c => `الحماية: ${COATING_DATA[c.dataIndex].protection}%`,
            },
          },
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } },
        },
      },
    })

    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [])

  const calcProt = () => {
    const res = calcProtection(+base, +coated)
    if (!res) { notify('أدخل القيم', 'warn'); return }
    const clr = res.pct > 80 ? '#00c896' : res.pct > 50 ? '#f5a623' : '#ff4d6a'
    setProtResult({ ...res, clr })
    notify('✅ نسبة الحماية: ' + res.pct + '%')
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> التحليل <span>›</span> مقارنة الطلاءات</div>
        <h2>مقارنة الطلاءات الواقية</h2>
        <p>قارن أداء الطلاءات المختلفة لاختيار الأفضل لتطبيقك</p>
      </div>

      {/* Comparison Table */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          🛡️ مقارنة فعالية الطلاءات
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                {['الطلاء', 'CR بدون طلاء', 'CR مع طلاء', 'الحماية %', 'التقييم', 'التوصية'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COATING_DATA.map(d => (
                <tr key={d.name}>
                  <td><strong>{d.name}</strong></td>
                  <td style={{ color: 'var(--red)' }}>8.03</td>
                  <td style={{ color: d.color, fontWeight: 700 }}>{d.cr}</td>
                  <td>
                    <span className="badge" style={{ background: d.color + '22', color: d.color }}>
                      {d.protection}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      d.protection >= 80 ? 'badge-green' :
                      d.protection >= 50 ? 'badge-amber' : 'badge-red'
                    }`}>
                      {d.protection >= 80 ? 'ممتاز' : d.protection >= 50 ? 'جيد' : 'مقبول'}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {d.name === 'إيبوكسي' ? '🏆 الخيار الأول' :
                     d.name === 'بدون طلاء' ? '❌ غير مناسب' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="card green">
        <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 14, fontSize: 13.5 }}>
          📊 رسم المقارنة
        </div>
        <canvas id="chart-compare" height={220} />
      </div>

      {/* Protection Calculator */}
      <div className="card blue">
        <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
          💡 احسب نسبة الحماية من بياناتك
        </div>
        <div className="g2">
          <div className="inp-g">
            <label>CR بدون طلاء (mm/yr)</label>
            <input
              type="number" value={base} placeholder="8.03" step="0.01"
              onChange={e => setBase(e.target.value)}
            />
          </div>
          <div className="inp-g">
            <label>CR مع الطلاء (mm/yr)</label>
            <input
              type="number" value={coated} placeholder="0.40" step="0.01"
              onChange={e => setCoated(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-blue" onClick={calcProt}>⚡ احسب نسبة الحماية</button>

        {protResult && (
          <div style={{ marginTop: 14 }}>
            <div className="rr">
              <span className="rl">نسبة الحماية</span>
              <span className="rv" style={{ color: protResult.clr, fontSize: 20 }}>
                {protResult.pct}%
              </span>
            </div>
            <div className="rr">
              <span className="rl">انخفاض CR</span>
              <span className="rv" style={{ color: 'var(--green)' }}>
                {protResult.reduction} mm/yr
              </span>
            </div>
            <div className="prog" style={{ marginTop: 8 }}>
              <div className="prog-bar" style={{
                width: protResult.pct + '%',
                background: `linear-gradient(90deg, var(--amber), ${protResult.clr})`,
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Coating Guide */}
      <div className="card purple">
        <div style={{ fontWeight: 800, color: 'var(--purple)', marginBottom: 14, fontSize: 13.5 }}>
          📚 دليل اختيار الطلاء
        </div>
        <div className="g2">
          {[
            ['🟫', 'إيبوكسي', 'var(--green)',
              'الأفضل للبيئات الحمضية والمالحة. مقاوم للصدمات. يدوم 10-15 سنة. مثالي للصناعة النفطية.'],
            ['🔵', 'أكريليك', 'var(--blue)',
              'مرن وسريع الجفاف. مناسب للبيئات الخفيفة. سهل التطبيق. اقتصادي.'],
            ['🟠', 'زيتي', 'var(--amber)',
              'تقليدي وواسع الانتشار. حماية متوسطة. يحتاج تجديداً دورياً كل 3-5 سنوات.'],
            ['⬜', 'زيت خروع', 'var(--muted)',
              'طبيعي وصديق للبيئة. حماية مؤقتة فقط. مناسب للتجارب المختبرية.'],
          ].map(([ic, name, clr, desc]) => (
            <div key={name} style={{
              background: 'var(--card)', borderRadius: 11,
              padding: '13px 15px', border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{ic}</div>
              <div style={{ fontWeight: 700, color: clr, marginBottom: 6, fontSize: 13 }}>{name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.8 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}