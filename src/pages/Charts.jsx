import { useEffect, useRef } from 'react'
import { REFERENCE_DATA, COATING_DATA } from '../utils/corrosion'

export default function Charts() {
  const charts = useRef({})

  const isDark    = () => document.documentElement.dataset.theme !== 'light'
  const textColor = () => isDark() ? '#5c7099' : '#475569'
  const gridColor = () => isDark() ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'

  const destroyChart = (id) => {
    if (charts.current[id]) {
      charts.current[id].destroy()
      delete charts.current[id]
    }
  }

  const drawBar = () => {
    destroyChart('bar')
    const canvas = document.getElementById('chart-bar')
    if (!canvas) return
    charts.current.bar = new window.Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: REFERENCE_DATA.map(d => `${d.metal}\n${d.sol}`),
        datasets: [{
          label: 'CR (mm/yr)',
          data: REFERENCE_DATA.map(d => d.cr),
          backgroundColor: REFERENCE_DATA.map(d => d.color),
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => c.raw + ' mm/yr' } },
        },
        scales: {
          x: { ticks: { color: textColor() }, grid: { color: gridColor() } },
          y: { ticks: { color: textColor() }, grid: { color: gridColor() } },
        },
      },
    })
  }

  const drawLine = () => {
    destroyChart('line')
    const canvas = document.getElementById('chart-line')
    if (!canvas) return
    charts.current.line = new window.Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['0h', '24h', '48h', '72h'],
        datasets: [
          {
            label: 'حديد + HCl',
            data: [2.000, 1.978, 1.956, 1.934],
            borderColor: '#ff4d6a',
            backgroundColor: 'rgba(255,77,106,.08)',
            tension: 0.4, fill: true,
            pointBackgroundColor: '#ff4d6a',
          },
          {
            label: 'نحاس + HCl',
            data: [2.000, 1.991, 1.982, 1.974],
            borderColor: '#f5a623',
            backgroundColor: 'rgba(245,166,35,.08)',
            tension: 0.4, fill: true,
            pointBackgroundColor: '#f5a623',
          },
          {
            label: 'ألمنيوم + HCl',
            data: [2.000, 1.987, 1.974, 1.961],
            borderColor: '#3d8ef0',
            backgroundColor: 'rgba(61,142,240,.08)',
            tension: 0.4, fill: true,
            pointBackgroundColor: '#3d8ef0',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: textColor() } },
          tooltip: { callbacks: { label: c => c.raw + ' mm' } },
        },
        scales: {
          x: { ticks: { color: textColor() }, grid: { color: gridColor() } },
          y: { ticks: { color: textColor() }, grid: { color: gridColor() } },
        },
      },
    })
  }

  const drawDoughnut = () => {
    destroyChart('doughnut')
    const canvas = document.getElementById('chart-doughnut')
    if (!canvas) return
    charts.current.doughnut = new window.Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['حديد', 'نحاس', 'ألمنيوم'],
        datasets: [{
          data: [50, 20, 30],
          backgroundColor: ['#ff4d6a', '#f5a623', '#3d8ef0'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor() },
          },
        },
      },
    })
  }

  const drawCoating = () => {
    destroyChart('coating')
    const canvas = document.getElementById('chart-coating')
    if (!canvas) return
    charts.current.coating = new window.Chart(canvas.getContext('2d'), {
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
              label: c => c.raw + ' mm/yr',
              afterLabel: c => `الحماية: ${COATING_DATA[c.dataIndex].protection}%`,
            },
          },
        },
        scales: {
          x: { ticks: { color: textColor() }, grid: { color: gridColor() } },
          y: { ticks: { color: textColor() }, grid: { color: gridColor() } },
        },
      },
    })
  }

  const drawScatter = () => {
    destroyChart('scatter')
    const canvas = document.getElementById('chart-scatter')
    if (!canvas) return
    charts.current.scatter = new window.Chart(canvas.getContext('2d'), {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'حديد',
            data: [
              { x: 0, y: 8.03 }, { x: 3.5, y: 5.48 },
              { x: 14, y: 2.19 }, { x: 7, y: 1.10 },
            ],
            backgroundColor: '#ff4d6a', pointRadius: 8,
          },
          {
            label: 'نحاس',
            data: [{ x: 0, y: 3.16 }, { x: 3.5, y: 1.34 }],
            backgroundColor: '#f5a623', pointRadius: 8,
          },
          {
            label: 'ألمنيوم',
            data: [{ x: 0, y: 4.75 }, { x: 14, y: 5.11 }],
            backgroundColor: '#3d8ef0', pointRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: textColor() } } },
        scales: {
          x: {
            title: { display: true, text: 'pH', color: textColor() },
            ticks: { color: textColor() }, grid: { color: gridColor() },
          },
          y: {
            title: { display: true, text: 'CR (mm/yr)', color: textColor() },
            ticks: { color: textColor() }, grid: { color: gridColor() },
          },
        },
      },
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      drawBar()
      drawLine()
      drawDoughnut()
      drawCoating()
      drawScatter()
    }, 100)
    return () => {
      clearTimeout(timer)
      Object.values(charts.current).forEach(c => c.destroy())
      charts.current = {}
    }
  }, [])

  const exportChart = (id) => {
    const canvas = document.getElementById(id)
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = id + '.png'
    a.click()
  }

  const redraw = () => {
    drawBar(); drawLine(); drawDoughnut(); drawCoating(); drawScatter()
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> البيانات <span>›</span> الرسوم البيانية</div>
        <h2>الرسوم البيانية التفاعلية</h2>
        <p>تحليل بصري شامل لنتائج التجربة</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <button className="btn btn-outline btn-sm" onClick={redraw}>🔄 تحديث</button>
        <div style={{ width: 1, height: 22, background: 'var(--border)' }} />
        <button className="btn btn-outline btn-sm" onClick={() => exportChart('chart-bar')}>📥 Bar PNG</button>
        <button className="btn btn-outline btn-sm" onClick={() => exportChart('chart-line')}>📥 Line PNG</button>
        <button className="btn btn-outline btn-sm" onClick={() => exportChart('chart-coating')}>📥 Coating PNG</button>
      </div>

      {/* Bar Chart */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          📊 معدلات التآكل المقارنة
        </div>
        <canvas id="chart-bar" height={260} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          {[
            ['#ff4d6a', 'شديد جداً (>10)'],
            ['#ff7a35', 'شديد (5-10)'],
            ['#f5a623', 'متوسط (2-5)'],
            ['#00c896', 'خفيف (<2)'],
          ].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--muted)' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: c, flexShrink: 0 }} />
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Line + Doughnut */}
      <div className="g2">
        <div className="card blue">
          <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
            📈 تطور السُمك بالزمن
          </div>
          <canvas id="chart-line" height={220} />
        </div>
        <div className="card green">
          <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 14, fontSize: 13.5 }}>
            🍩 نسبة التآكل حسب المعدن
          </div>
          <canvas id="chart-doughnut" height={220} />
        </div>
      </div>

      {/* Coating Chart */}
      <div className="card purple">
        <div style={{ fontWeight: 800, color: 'var(--purple)', marginBottom: 14, fontSize: 13.5 }}>
          🛡️ مقارنة فعالية الطلاءات
        </div>
        <canvas id="chart-coating" height={200} />
      </div>

      {/* Scatter */}
      <div className="card cyan" style={{ borderColor: 'rgba(34,211,238,.3)' }}>
        <div style={{ fontWeight: 800, color: 'var(--cyan)', marginBottom: 14, fontSize: 13.5 }}>
          🎯 علاقة pH بمعدل التآكل (Scatter)
        </div>
        <canvas id="chart-scatter" height={220} />
      </div>
    </div>
  )
}
