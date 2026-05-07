// ══════════════════════════════
//  نظام الأصوات المحسّن
// ══════════════════════════════

let globalCtx = null
let currentNodes = []

// وقف الصوت الحالي قبل تشغيل جديد
function stopCurrent() {
  currentNodes.forEach(n => { try { n.stop() } catch (e) {} })
  currentNodes = []
}

function getCtx() {
  if (!globalCtx || globalCtx.state === 'closed') {
    globalCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return globalCtx
}

export const SOUNDS = {
  beep: {
    name: 'صفارة',
    icon: '🔔',
    play: (duration = 0.35, volume = 0.5) => {
      stopCurrent()
      const ctx  = getCtx()
      const gain = ctx.createGain()
      gain.connect(ctx.destination)
      ;[0, 0.4, 0.8].forEach(t => {
        const osc = ctx.createOscillator()
        osc.connect(gain)
        osc.frequency.setValueAtTime(880, ctx.currentTime + t)
        gain.gain.setValueAtTime(volume, ctx.currentTime + t)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + duration)
        osc.start(ctx.currentTime + t)
        osc.stop(ctx.currentTime + t + duration)
        currentNodes.push(osc)
      })
    }
  },

  alarm: {
    name: 'إنذار',
    icon: '🚨',
    play: (duration = 0.5, volume = 0.5) => {
      stopCurrent()
      const ctx  = getCtx()
      const gain = ctx.createGain()
      gain.connect(ctx.destination)
      const step = duration / 6
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator()
        osc.connect(gain)
        osc.frequency.setValueAtTime(i % 2 === 0 ? 1000 : 700, ctx.currentTime + i * step)
        gain.gain.setValueAtTime(volume, ctx.currentTime + i * step)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * step + step)
        osc.start(ctx.currentTime + i * step)
        osc.stop(ctx.currentTime + i * step + step)
        currentNodes.push(osc)
      }
    }
  },

  chime: {
    name: 'رنين ناعم',
    icon: '🎵',
    play: (duration = 0.8, volume = 0.4) => {
      stopCurrent()
      const ctx   = getCtx()
      const gain  = ctx.createGain()
      gain.connect(ctx.destination)
      const freqs = [523, 659, 784, 1047]
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator()
        osc.type  = 'sine'
        osc.connect(gain)
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.2)
        gain.gain.setValueAtTime(volume, ctx.currentTime + i * 0.2)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + duration)
        osc.start(ctx.currentTime + i * 0.2)
        osc.stop(ctx.currentTime + i * 0.2 + duration)
        currentNodes.push(osc)
      })
    }
  },

  ping: {
    name: 'نقرة',
    icon: '🔵',
    play: (duration = 0.3, volume = 0.6) => {
      stopCurrent()
      const ctx  = getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + duration)
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
      currentNodes.push(osc)
    }
  },

  horn: {
    name: 'بوق',
    icon: '📯',
    play: (duration = 1.0, volume = 0.5) => {
      stopCurrent()
      const ctx  = getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      osc.frequency.setValueAtTime(330, ctx.currentTime + duration * 0.3)
      osc.frequency.setValueAtTime(440, ctx.currentTime + duration * 0.6)
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
      currentNodes.push(osc)
    }
  },

  custom: {
    name: 'صوت مخصص',
    icon: '🎤',
    play: (duration = 0.5, volume = 0.5, freq = 880) => {
      stopCurrent()
      const ctx  = getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
      currentNodes.push(osc)
    }
  },
}

export function playSound(soundId, duration, volume, freq) {
  try {
    const s = SOUNDS[soundId]
    if (s) s.play(duration, volume, freq)
  } catch (e) {
    console.error('Sound error:', e)
  }
}

export function stopSound() {
  stopCurrent()
}