import { useState, useRef } from 'react'
import useStore from '../store'

export default function Photos() {
  const { notify } = useStore()
  const [photos, setPhotos] = useState([])
  const [cat, setCat]       = useState('قبل التجربة')
  const [selected, setSelected] = useState(null)
  const inputRef = useRef(null)

  const addFiles = (files) => {
    const newPhotos = []
    let loaded = 0
    ;[...files].forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        newPhotos.push({
          src:  e.target.result,
          cat,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          time: new Date().toLocaleString('ar'),
        })
        loaded++
        if (loaded === files.length) {
          setPhotos(p => [...p, ...newPhotos])
          notify(`📸 تم رفع ${files.length} صورة`)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (i) => {
    setPhotos(p => p.filter((_, j) => j !== i))
    if (selected === i) setSelected(null)
    notify('🗑️ تم حذف الصورة')
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> البيانات <span>›</span> الصور</div>
        <h2>توثيق صور التجربة</h2>
        <p>ارفع وصنّف صور التجربة قبل وبعد لتوثيق النتائج</p>
      </div>

      {/* Upload */}
      <div className="card green">
        <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 14, fontSize: 13.5 }}>
          📸 رفع الصور
        </div>

        {/* Drop Zone */}
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--amber)' }}
          onDragLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
          onDrop={e => {
            e.preventDefault()
            e.currentTarget.style.borderColor = 'var(--border2)'
            addFiles(e.dataTransfer.files)
          }}
          style={{
            border: '2px dashed var(--border2)',
            borderRadius: 14, padding: '36px 20px',
            textAlign: 'center', cursor: 'pointer',
            transition: 'all .2s', background: 'var(--card)',
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 12 }}>📷</div>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text2)', marginBottom: 5 }}>
            اضغط لرفع صور أو اسحب وأفلت
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            JPG, PNG, WEBP — يدعم الصور المتعددة
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => addFiles(e.target.files)}
        />

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0', alignItems: 'center' }}>
          <label style={{ fontSize: 11, color: 'var(--muted)' }}>التصنيف:</label>
          <select
            value={cat}
            onChange={e => setCat(e.target.value)}
            style={{
              background: 'var(--card)', border: '1px solid var(--border2)',
              color: 'var(--text)', padding: '6px 10px',
              borderRadius: 8, fontSize: 12, outline: 'none',
            }}
          >
            {['قبل التجربة', 'بعد التجربة', 'بعد 24h', 'بعد 48h', 'بعد 72h', 'تجربة الطلاء'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {photos.length > 0 && (
            <button
              className="btn btn-red btn-sm"
              onClick={() => { if (confirm('مسح كل الصور؟')) { setPhotos([]); setSelected(null) } }}
            >
              🗑️ مسح الكل
            </button>
          )}
          {photos.length > 0 && (
            <span style={{ fontSize: 11, color: 'var(--muted)', marginRight: 'auto' }}>
              {photos.length} صورة
            </span>
          )}
        </div>

        {/* Grid */}
        {photos.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 24, fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📁</div>
            لا توجد صور — ارفع صور التجربة قبل وبعد
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 10, marginTop: 14,
          }}>
            {photos.map((p, i) => (
              <div
                key={i}
                style={{
                  position: 'relative', borderRadius: 11,
                  overflow: 'hidden', aspectRatio: '1',
                  background: 'var(--card2)',
                  border: `2px solid ${selected === i ? 'var(--amber)' : 'var(--border)'}`,
                  cursor: 'pointer', transition: 'all .2s',
                }}
                onClick={() => setSelected(selected === i ? null : i)}
              >
                <img src={p.src} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={e => { e.stopPropagation(); removePhoto(i) }}
                  style={{
                    position: 'absolute', top: 7, left: 7,
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'rgba(255,77,106,.9)', border: 'none',
                    cursor: 'pointer', color: '#fff', fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >×</button>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(0,0,0,.75)', color: '#fff',
                  fontSize: 8.5, padding: '4px 7px', textAlign: 'center',
                }}>
                  {p.cat}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Photo Details */}
      {selected !== null && photos[selected] && (
        <div className="card amber">
          <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 12, fontSize: 13.5 }}>
            🔍 تفاصيل الصورة المحددة
          </div>
          <div className="g2">
            <img
              src={photos[selected].src}
              alt="selected"
              style={{ width: '100%', borderRadius: 11, objectFit: 'cover', maxHeight: 200 }}
            />
            <div>
              {[
                ['اسم الملف', photos[selected].name],
                ['التصنيف',   photos[selected].cat],
                ['الحجم',     photos[selected].size],
                ['وقت الرفع', photos[selected].time],
              ].map(([l, v]) => (
                <div key={l} className="rr">
                  <span className="rl">{l}</span>
                  <span className="rv" style={{ fontSize: 11, color: 'var(--text2)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 12, fontSize: 13.5 }}>
          💡 نصائح التوثيق الفوتوغرافي
        </div>
        {[
          '📸 صوّر كل عينة من نفس المسافة والزاوية قبل وبعد التجربة',
          '🏷️ ضع بطاقة تسمية بجانب كل عينة في الصورة',
          '💡 استخدم إضاءة ثابتة لجميع الصور للمقارنة الدقيقة',
          '📏 ضع مسطرة في الصورة كمرجع للحجم',
          '🔍 التقط صور مقربة (Macro) لمناطق التآكل الواضحة',
          '🗂️ رتّب الصور حسب الفئة للتقرير الأكاديمي',
        ].map(t => (
          <div key={t} style={{
            padding: '7px 0', borderBottom: '1px solid var(--border)',
            fontSize: 12.5, color: 'var(--text2)',
          }}>{t}</div>
        ))}
      </div>
    </div>
  )
}