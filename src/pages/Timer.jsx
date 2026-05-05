import { useState, useEffect, useRef } from 'react'
import useStore from '../store'

export default function Timer() {
  const { notify } = useStore()
  const [secs, setSecs]       = useState(0)
  const [running, setRunning] = useState(false)
  const [alarms, setAlarms]   = useState({})
  const [log, setLog]         = useState([])
  const [cdH, setCdH]         = useState(72)
  const [cdM, setCdM]         = useState(0)
  const [cdSecs, setCdSecs]   = useState(0)
  const [cdRunning, setCdRunning] = useState(false)
  const timerRef = useRef(null)
  const cdRef    = useRef(null)

  const pad  = n => String(n).padStart(2, '0')
  const fmt  = s => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
  const addLog = msg => setLog(l => [{ msg, time: new Date().toLocaleTimeString('ar') }, ...l.slice(0, 19)])

  // ── Main Timer ──
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [running])

  // ── Check Alarms ──
  useEffect(() => {
    Object.entries(alarms).forEach(([h, target]) => {
      if (target !== null && secs >= target && !alarms[`done_${h}`]) {
        setAlarms(a => ({ ...a, [`done_${h}`]: true }))
        notify(`🔔 حان وقت القياس! ${h}h مرّت`, 'warn')
        addLog(`🔔 تنبيه ${h}h — وقت القياس!`)
        if (window.Notification?.permission === 'granted') {
          new window.Notification('مشروع أحمد — وقت القياس!', {
            body: `مرّت ${h} ساعة — قِس السُمك الآن`,
          })
        }
      }
    })
  }, [secs])

  const start = () => {
    if (running) return
    setRunning(true)
    addLog('▶ بدأت التجربة')
    notify('▶ بدأ مؤقت التجربة')
    if (window.Notification?.permission === 'default') {
      window.Notification.requestPermission()
    }
  }

  const pause = () => {
    setRunning(false)
    addLog('⏸ إيقاف مؤقت')
    notify('⏸ توقف مؤقت')
  }

  const reset = () => {
    setRunning(false)
    setSecs(0)
    setAlarms({})
    setLog([])
    notify('↺ تم إعادة الضبط')
  }

  const setAlarm = (h) => {
    setAlarms(a => ({ ...a, [h]: h * 3600 }))
    notify(`🔔 تنبيه مفعّل عند ${h}h`)
    addLog(`🔔 تم ضبط تنبيه عند ${h}h`)
  }

  // ── Countdown ──
  useEffect(() => {
    if (cdRunning) {
      cdRef.current = setInterval(() => {
        setCdSecs(s => {
          if (s <= 1) {
            clearInterval(cdRef.current)
            setCdRunning(false)
            notify('⏰ انتهى العد التنازلي!', 'warn')
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(cdRef.current)
    }
    return () => clearInterval(cdRef.current)
  }, [cdRunning])

  const startCD = () => {
    if (cdRunning) return
    const total = cdH * 3600 + cdM * 60
    if (!total) { notify('أدخل وقت العد', 'warn'); return }
    if (!cdSecs) setCdSecs(total)
    setCdRunning(true)
  }

  const resetCD = () => {
    setCdRunning(false)
    setCdSecs(0)
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> التجربة <span>›</span> المؤقت</div>
        <h2>المؤقت الذكي</h2>
        <p>تتبع مواعيد التجربة مع تنبيهات تلقائية عند حلول وقت القياس</p>
      </div>

      {/* Main Timer */}
      <div className="card amber" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--amber)', marginBottom: 4 }}>
          ⏱️ مؤقت التجربة
        </div>
        <div style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 10 }}>
          الوقت المنقضي منذ بدء التغمير
        </div>

        {/* Display */}
        <div style={{
          fontSize: 'clamp(38px,7vw,68px)',
          fontWeight: 900,
          fontFamily: 'var(--mono)',
          color: running ? 'var(--amber)' : 'var(--muted)',
          letterSpacing: 7,
          textShadow: running ? '0 0 30px rgba(245,166,35,.35)' : 'none',
          margin: '12px 0',
          transition: 'color .3s',
        }}>
          {fmt(secs)}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <button
            className="btn btn-amber"
            style={{ fontSize: 15, padding: '12px 28px' }}
            onClick={start}
            disabled={running}
          >
            ▶ ابدأ التجربة
          </button>
          <button className="btn btn-outline" onClick={pause} disabled={!running}>
            ⏸ إيقاف مؤقت
          </button>
          <button className="btn btn-red" onClick={reset}>
            ↺ إعادة الضبط
          </button>
        </div>

        {/* Alarm Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[24, 48, 72].map(h => (
            <button
              key={h}
              onClick={() => setAlarm(h)}
              style={{
                padding: '7px 16px', borderRadius: 9,
                fontSize: 11.5, fontWeight: 700,
                border: '1px solid',
                cursor: 'pointer', transition: 'all .18s',
                background: alarms[`done_${h}`]
                  ? 'rgba(0,200,150,.12)'
                  : alarms[h] !== undefined
                    ? 'rgba(245,166,35,.12)'
                    : 'var(--card2)',
                borderColor: alarms[`done_${h}`]
                  ? 'var(--green)'
                  : alarms[h] !== undefined
                    ? 'var(--amber)'
                    : 'var(--border)',
                color: alarms[`done_${h}`]
                  ? 'var(--green)'
                  : alarms[h] !== undefined
                    ? 'var(--amber)'
                    : 'var(--muted)',
              }}
            >
              {alarms[`done_${h}`] ? `✓ ${h}h` : `🔔 تنبيه عند ${h}h`}
            </button>
          ))}
        </div>
      </div>

      <div className="g2">
        {/* Alarms List */}
        <div className="card green">
          <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 14, fontSize: 13.5 }}>
            🔔 التنبيهات المفعّلة
          </div>
          {Object.keys(alarms).filter(k => !k.startsWith('done_')).length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>
              اضغط الأزرار أعلاه لإضافة تنبيهات عند مواعيد القياس
            </div>
          ) : (
            Object.entries(alarms)
              .filter(([k]) => !k.startsWith('done_'))
              .map(([h]) => (
                <div key={h} style={{
                  padding: '7px 0', borderBottom: '1px solid var(--border)',
                  fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  🔔 تنبيه عند{' '}
                  <strong style={{ color: 'var(--amber)' }}>{h}h</strong>
                  {alarms[`done_${h}`] && <span className="badge badge-green">✓ تم</span>}
                </div>
              ))
          )}
        </div>

        {/* Countdown */}
        <div className="card blue">
          <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
            ⏲️ عد تنازلي مخصص
          </div>
          <div className="g2">
            <div className="inp-g">
              <label>الساعات</label>
              <input
                type="number" value={cdH} min={0} max={999}
                style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}
                onChange={e => setCdH(+e.target.value)}
              />
            </div>
            <div className="inp-g">
              <label>الدقائق</label>
              <input
                type="number" value={cdM} min={0} max={59}
                style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}
                onChange={e => setCdM(+e.target.value)}
              />
            </div>
          </div>
          <div style={{
            fontSize: 26, fontWeight: 900, color: 'var(--blue)',
            fontFamily: 'var(--mono)', textAlign: 'center', padding: '8px 0',
          }}>
            {fmt(cdSecs || (cdH * 3600 + cdM * 60))}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="btn btn-blue btn-sm" onClick={startCD}>▶ ابدأ</button>
            <button className="btn btn-outline btn-sm" onClick={resetCD}>↺ إعادة</button>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="card purple">
        <div style={{ fontWeight: 800, color: 'var(--purple)', marginBottom: 14, fontSize: 13.5 }}>
          📋 سجل الأحداث
        </div>
        {log.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: 12, textAlign: 'center', padding: 14 }}>
            لا توجد أحداث مسجلة
          </div>
        ) : (
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {log.map((e, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12,
              }}>
                <span>{e.msg}</span>
                <span style={{ color: 'var(--muted)', fontSize: 10 }}>{e.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="info">
        💡 <strong style={{ color: 'var(--amber)' }}>نصيحة:</strong> فعّل تنبيهات المتصفح
        عند طلبها لتلقي إشعارات حتى عند إغلاق التبويب.
        ابدأ المؤقت عند وضع العينات في المحاليل.
      </div>
    </div>
  )
}