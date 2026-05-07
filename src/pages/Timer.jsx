import { useState, useEffect, useRef } from 'react'
import useStore from '../store'
import { SOUNDS, playSound } from '../utils/sounds'

const DEFAULT_SETTINGS = {
  soundId:  'beep',
  duration: 0.35,
  volume:   0.5,
  freq:     880,
}

function SoundPanel({ settings, setSettings }) {
  return (
    <div className="card purple">
      <div style={{ fontWeight: 800, color: 'var(--purple)', marginBottom: 14, fontSize: 13.5 }}>
        🔊 إعدادات الصوت
      </div>

      {/* Sound Type */}
      <div className="inp-g">
        <label>نوع الصوت</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(SOUNDS).map(([id, s]) => (
            <button
              key={id}
              onClick={() => {
                setSettings(p => ({ ...p, soundId: id }))
                playSound(id, settings.duration, settings.volume, settings.freq)
              }}
              style={{
                padding: '7px 14px', borderRadius: 9,
                fontSize: 12, fontWeight: 700,
                border: '1px solid', cursor: 'pointer', transition: 'all .18s',
                background: settings.soundId === id ? 'rgba(157,111,255,.15)' : 'var(--card)',
                borderColor: settings.soundId === id ? 'var(--purple)' : 'var(--border)',
                color: settings.soundId === id ? 'var(--purple)' : 'var(--muted)',
              }}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Volume */}
      <div className="inp-g">
        <label>مستوى الصوت — {Math.round(settings.volume * 100)}%</label>
        <input
          type="range" min={0.1} max={1} step={0.05}
          value={settings.volume}
          style={{ width: '100%', accentColor: 'var(--purple)' }}
          onChange={e => setSettings(p => ({ ...p, volume: +e.target.value }))}
          onMouseUp={e => playSound(settings.soundId, settings.duration, +e.target.value, settings.freq)}
          onTouchEnd={() => playSound(settings.soundId, settings.duration, settings.volume, settings.freq)}
        />
      </div>

      {/* Duration */}
      <div className="inp-g">
        <label>مدة الصوت — {settings.duration}s</label>
        <input
          type="range" min={0.1} max={2} step={0.05}
          value={settings.duration}
          style={{ width: '100%', accentColor: 'var(--purple)' }}
          onChange={e => setSettings(p => ({ ...p, duration: +e.target.value }))}
          onMouseUp={e => playSound(settings.soundId, +e.target.value, settings.volume, settings.freq)}
          onTouchEnd={() => playSound(settings.soundId, settings.duration, settings.volume, settings.freq)}
        />
      </div>

      {/* Custom Freq */}
      {settings.soundId === 'custom' && (
        <div className="inp-g">
          <label>التردد (Hz) — {settings.freq}Hz</label>
          <input
            type="range" min={200} max={2000} step={10}
            value={settings.freq}
            style={{ width: '100%', accentColor: 'var(--purple)' }}
            onChange={e => setSettings(p => ({ ...p, freq: +e.target.value }))}
            onMouseUp={e => playSound(settings.soundId, settings.duration, settings.volume, +e.target.value)}
            onTouchEnd={() => playSound(settings.soundId, settings.duration, settings.volume, settings.freq)}
          />
        </div>
      )}

      {/* Test Button */}
      <button
        className="btn btn-purple btn-sm"
        onClick={() => playSound(settings.soundId, settings.duration, settings.volume, settings.freq)}
      >
        ▶ تجربة الصوت
      </button>
    </div>
  )
}

export default function Timer() {
  const { notify } = useStore()
  const [secs, setSecs]           = useState(0)
  const [running, setRunning]     = useState(false)
  const [alarms, setAlarms]       = useState({})
  const [log, setLog]             = useState([])
  const [cdH, setCdH]             = useState(72)
  const [cdM, setCdM]             = useState(0)
  const [cdSecs, setCdSecs]       = useState(0)
  const [cdRunning, setCdRunning] = useState(false)
  const [settings, setSettings]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('soundSettings')) || DEFAULT_SETTINGS }
    catch { return DEFAULT_SETTINGS }
  })
  const timerRef = useRef(null)
  const cdRef    = useRef(null)

  useEffect(() => {
    localStorage.setItem('soundSettings', JSON.stringify(settings))
  }, [settings])

  const pad    = n => String(n).padStart(2, '0')
  const fmt    = s => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
  const addLog = msg => setLog(l => [{ msg, time: new Date().toLocaleTimeString('ar') }, ...l.slice(0, 19)])
  const beep   = () => playSound(settings.soundId, settings.duration, settings.volume, settings.freq)

  // Main Timer
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [running])

  // Check Alarms
  useEffect(() => {
    Object.entries(alarms).forEach(([h, target]) => {
      if (target !== null && secs >= target && !alarms[`done_${h}`]) {
        setAlarms(a => ({ ...a, [`done_${h}`]: true }))
        beep()
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

  const start  = () => {
    if (running) return
    setRunning(true)
    addLog('▶ بدأت التجربة')
    notify('▶ بدأ مؤقت التجربة')
    if (window.Notification?.permission === 'default') window.Notification.requestPermission()
  }
  const pause  = () => { setRunning(false); addLog('⏸ إيقاف مؤقت'); notify('⏸ توقف مؤقت') }
  const reset  = () => { setRunning(false); setSecs(0); setAlarms({}); setLog([]); notify('↺ تم إعادة الضبط') }
  const setAlarm = h => {
    setAlarms(a => ({ ...a, [h]: h * 3600 }))
    notify(`🔔 تنبيه عند ${h}h`)
    addLog(`🔔 تم ضبط تنبيه عند ${h}h`)
  }

  // Countdown
  useEffect(() => {
    if (cdRunning) {
      cdRef.current = setInterval(() => {
        setCdSecs(s => {
          if (s <= 1) {
            clearInterval(cdRef.current)
            setCdRunning(false)
            beep()
            notify('⏰ انتهى العد التنازلي!', 'warn')
            addLog('⏰ انتهى العد التنازلي!')
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

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> التجربة <span>›</span> المؤقت</div>
        <h2>المؤقت الذكي</h2>
        <p>تتبع مواعيد التجربة مع تنبيهات صوتية قابلة للتخصيص</p>
      </div>

      {/* Main Timer */}
      <div className="card amber" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--amber)', marginBottom: 4 }}>
          ⏱️ مؤقت التجربة
        </div>
        <div style={{ fontSize: 9.5, color: 'var(--muted)', marginBottom: 10 }}>
          الوقت المنقضي منذ بدء التغمير
        </div>
        <div style={{
          fontSize: 'clamp(38px,7vw,68px)', fontWeight: 900,
          fontFamily: 'var(--mono)',
          color: running ? 'var(--amber)' : 'var(--muted)',
          letterSpacing: 7,
          textShadow: running ? '0 0 30px rgba(245,166,35,.35)' : 'none',
          margin: '12px 0', transition: 'color .3s',
        }}>
          {fmt(secs)}
        </div>
        <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <button className="btn btn-amber" style={{ fontSize: 15, padding: '12px 28px' }} onClick={start} disabled={running}>
            ▶ ابدأ التجربة
          </button>
          <button className="btn btn-outline" onClick={pause} disabled={!running}>⏸ إيقاف مؤقت</button>
          <button className="btn btn-red" onClick={reset}>↺ إعادة الضبط</button>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[24, 48, 72].map(h => (
            <button key={h} onClick={() => setAlarm(h)} style={{
              padding: '7px 16px', borderRadius: 9, fontSize: 11.5, fontWeight: 700,
              border: '1px solid', cursor: 'pointer', transition: 'all .18s',
              background: alarms[`done_${h}`] ? 'rgba(0,200,150,.12)' : alarms[h] !== undefined ? 'rgba(245,166,35,.12)' : 'var(--card2)',
              borderColor: alarms[`done_${h}`] ? 'var(--green)' : alarms[h] !== undefined ? 'var(--amber)' : 'var(--border)',
              color: alarms[`done_${h}`] ? 'var(--green)' : alarms[h] !== undefined ? 'var(--amber)' : 'var(--muted)',
            }}>
              {alarms[`done_${h}`] ? `✓ ${h}h` : `🔔 تنبيه عند ${h}h`}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Panel */}
      <SoundPanel settings={settings} setSettings={setSettings} />

      <div className="g2">
        <div className="card green">
          <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 14, fontSize: 13.5 }}>
            🔔 التنبيهات المفعّلة
          </div>
          {Object.keys(alarms).filter(k => !k.startsWith('done_')).length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>اضغط الأزرار أعلاه لإضافة تنبيهات</div>
          ) : (
            Object.entries(alarms).filter(([k]) => !k.startsWith('done_')).map(([h]) => (
              <div key={h} style={{
                padding: '7px 0', borderBottom: '1px solid var(--border)',
                fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                🔔 تنبيه عند <strong style={{ color: 'var(--amber)' }}>{h}h</strong>
                {alarms[`done_${h}`] && <span className="badge badge-green">✓ تم</span>}
              </div>
            ))
          )}
        </div>

        <div className="card blue">
          <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
            ⏲️ عد تنازلي مخصص
          </div>
          <div className="g2">
            <div className="inp-g">
              <label>الساعات</label>
              <input type="number" value={cdH} min={0} max={999}
                style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}
                onChange={e => setCdH(+e.target.value)} />
            </div>
            <div className="inp-g">
              <label>الدقائق</label>
              <input type="number" value={cdM} min={0} max={59}
                style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}
                onChange={e => setCdM(+e.target.value)} />
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
            <button className="btn btn-outline btn-sm" onClick={() => { setCdRunning(false); setCdSecs(0) }}>↺ إعادة</button>
          </div>
        </div>
      </div>

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
    </div>
  )
}