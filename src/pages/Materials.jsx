import { useState } from 'react'
import useStore from '../store'

const DEFAULT_METALS = [
  { ico: '🔴', name: 'حديد (Fe)',    en: 'Carbon Steel',  clr: '#f87171', desc: 'الأكثر شيوعاً في الصناعة. عرضة للصدأ والتآكل الكيمياوي.', badge: 'مقاومة منخفضة',       bc: 'badge-red' },
  { ico: '🟡', name: 'نحاس (Cu)',    en: 'Copper',         clr: '#fbbf24', desc: 'مقاومة جيدة للتآكل. يُكوّن طبقة Cu₂O واقية طبيعية.',     badge: 'مقاومة متوسطة-عالية', bc: 'badge-amber' },
  { ico: '⚪', name: 'ألمنيوم (Al)', en: 'Aluminum Alloy', clr: '#60a5fa', desc: 'خفيف الوزن. طبقة Al₂O₃ واقية لكن حساس للأحماض.',          badge: 'حساس للأحماض',        bc: 'badge-blue' },
]

const DEFAULT_SOLUTIONS = [
  { name: 'HCl — حمض الهيدروكلوريك', conc: '1M',   ph: '~0',  nat: 'حمضي قوي',    bc: 'badge-red',   av: 'محل كيمياوي' },
  { name: 'NaCl — كلوريد الصوديوم',  conc: '3.5%', ph: '~7',  nat: 'محايد',        bc: 'badge-amber', av: 'ملح الطعام' },
  { name: 'NaOH — هيدروكسيد الصوديوم',conc: '1M',  ph: '~14', nat: 'قاعدي قوي',   bc: 'badge-blue',  av: 'محل كيمياوي' },
  { name: 'H₂O — ماء مقطر',          conc: '100%', ph: '7',   nat: 'محايد (مرجع)', bc: 'badge-green', av: 'صيدلية' },
]

const DEFAULT_COATINGS = [
  { ic: '🟫', name: 'إيبوكسي (Epoxy)',       eff: '85-95%', bc: 'badge-green' },
  { ic: '🟠', name: 'دهان زيتي (Oil Paint)', eff: '50-60%', bc: 'badge-amber' },
  { ic: '⬜', name: 'زيت خروع (Castor Oil)', eff: '30-40%', bc: 'badge-amber' },
  { ic: '🔵', name: 'أكريليك (Acrylic)',     eff: '40-55%', bc: 'badge-amber' },
]

const LS_KEY_M = 'custom_metals'
const LS_KEY_S = 'custom_solutions'
const LS_KEY_C = 'custom_coatings'

export default function Materials() {
  const { notify } = useStore()

  const [metals,    setMetals]    = useState(() => { try { return JSON.parse(localStorage.getItem(LS_KEY_M)) || DEFAULT_METALS    } catch { return DEFAULT_METALS    } })
  const [solutions, setSolutions] = useState(() => { try { return JSON.parse(localStorage.getItem(LS_KEY_S)) || DEFAULT_SOLUTIONS } catch { return DEFAULT_SOLUTIONS } })
  const [coatings,  setCoatings]  = useState(() => { try { return JSON.parse(localStorage.getItem(LS_KEY_C)) || DEFAULT_COATINGS  } catch { return DEFAULT_COATINGS  } })

  // Add Metal
  const [showAddMetal, setShowAddMetal] = useState(false)
  const [newMetal, setNewMetal] = useState({ ico: '⚙️', name: '', en: '', clr: '#94a3b8', desc: '', badge: '', bc: 'badge-blue' })

  // Add Solution
  const [showAddSol, setShowAddSol] = useState(false)
  const [newSol, setNewSol] = useState({ name: '', conc: '', ph: '', nat: '', bc: 'badge-amber', av: '' })

  // Add Coating
  const [showAddCoat, setShowAddCoat] = useState(false)
  const [newCoat, setNewCoat] = useState({ ic: '🎨', name: '', eff: '', bc: 'badge-amber' })

  const saveMetal = () => {
    if (!newMetal.name) { notify('أدخل اسم المعدن', 'warn'); return }
    const updated = [...metals, newMetal]
    setMetals(updated)
    localStorage.setItem(LS_KEY_M, JSON.stringify(updated))
    setShowAddMetal(false)
    setNewMetal({ ico: '⚙️', name: '', en: '', clr: '#94a3b8', desc: '', badge: '', bc: 'badge-blue' })
    notify('✅ تم إضافة المعدن')
  }

  const removeMetal = (i) => {
    const updated = metals.filter((_, j) => j !== i)
    setMetals(updated)
    localStorage.setItem(LS_KEY_M, JSON.stringify(updated))
    notify('🗑️ تم حذف المعدن')
  }

  const saveSol = () => {
    if (!newSol.name) { notify('أدخل اسم المحلول', 'warn'); return }
    const updated = [...solutions, newSol]
    setSolutions(updated)
    localStorage.setItem(LS_KEY_S, JSON.stringify(updated))
    setShowAddSol(false)
    setNewSol({ name: '', conc: '', ph: '', nat: '', bc: 'badge-amber', av: '' })
    notify('✅ تم إضافة المحلول')
  }

  const removeSol = (i) => {
    const updated = solutions.filter((_, j) => j !== i)
    setSolutions(updated)
    localStorage.setItem(LS_KEY_S, JSON.stringify(updated))
    notify('🗑️ تم الحذف')
  }

  const saveCoat = () => {
    if (!newCoat.name) { notify('أدخل اسم الطلاء', 'warn'); return }
    const updated = [...coatings, newCoat]
    setCoatings(updated)
    localStorage.setItem(LS_KEY_C, JSON.stringify(updated))
    setShowAddCoat(false)
    setNewCoat({ ic: '🎨', name: '', eff: '', bc: 'badge-amber' })
    notify('✅ تم إضافة الطلاء')
  }

  const removeCoat = (i) => {
    const updated = coatings.filter((_, j) => j !== i)
    setCoatings(updated)
    localStorage.setItem(LS_KEY_C, JSON.stringify(updated))
    notify('🗑️ تم الحذف')
  }

  const resetAll = () => {
    if (!confirm('إعادة تعيين كل المواد للقيم الافتراضية؟')) return
    setMetals(DEFAULT_METALS);    localStorage.setItem(LS_KEY_M, JSON.stringify(DEFAULT_METALS))
    setSolutions(DEFAULT_SOLUTIONS); localStorage.setItem(LS_KEY_S, JSON.stringify(DEFAULT_SOLUTIONS))
    setCoatings(DEFAULT_COATINGS);  localStorage.setItem(LS_KEY_C, JSON.stringify(DEFAULT_COATINGS))
    notify('↺ تم إعادة التعيين')
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> المواد</div>
        <h2>المواد والتجهيز</h2>
        <p>العينات المعدنية، المحاليل الكيمياوية، الطلاءات والأدوات — قابلة للتخصيص</p>
      </div>

      {/* ══ METALS ══ */}
      <div className="card blue">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 800, color: 'var(--blue)', fontSize: 13.5 }}>🔩 العينات المعدنية</div>
          <div style={{ display: 'flex', gap: 7 }}>
            <button className="btn btn-blue btn-sm" onClick={() => setShowAddMetal(!showAddMetal)}>
              ➕ إضافة معدن
            </button>
            <button className="btn btn-outline btn-sm" onClick={resetAll}>↺ إعادة تعيين</button>
          </div>
        </div>

        {/* Add Metal Form */}
        {showAddMetal && (
          <div style={{ background: 'var(--card)', borderRadius: 11, padding: 16, marginBottom: 14, border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--blue)', marginBottom: 12 }}>➕ إضافة معدن جديد</div>
            <div className="g3">
              <div className="inp-g">
                <label>الرمز (Emoji)</label>
                <input value={newMetal.ico} onChange={e => setNewMetal(p => ({ ...p, ico: e.target.value }))} placeholder="⚙️" />
              </div>
              <div className="inp-g">
                <label>الاسم بالعربي</label>
                <input value={newMetal.name} onChange={e => setNewMetal(p => ({ ...p, name: e.target.value }))} placeholder="حديد (Fe)" />
              </div>
              <div className="inp-g">
                <label>الاسم بالإنجليزي</label>
                <input value={newMetal.en} onChange={e => setNewMetal(p => ({ ...p, en: e.target.value }))} placeholder="Carbon Steel" />
              </div>
            </div>
            <div className="inp-g">
              <label>الوصف</label>
              <input value={newMetal.desc} onChange={e => setNewMetal(p => ({ ...p, desc: e.target.value }))} placeholder="وصف المعدن..." />
            </div>
            <div className="g2">
              <div className="inp-g">
                <label>تصنيف المقاومة</label>
                <input value={newMetal.badge} onChange={e => setNewMetal(p => ({ ...p, badge: e.target.value }))} placeholder="مقاومة عالية" />
              </div>
              <div className="inp-g">
                <label>لون البطاقة</label>
                <select value={newMetal.bc} onChange={e => setNewMetal(p => ({ ...p, bc: e.target.value }))}>
                  <option value="badge-green">أخضر</option>
                  <option value="badge-amber">برتقالي</option>
                  <option value="badge-red">أحمر</option>
                  <option value="badge-blue">أزرق</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-blue btn-sm" onClick={saveMetal}>💾 حفظ</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddMetal(false)}>إلغاء</button>
            </div>
          </div>
        )}

        <div className="g3">
          {metals.map((m, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: `1px solid ${m.clr}44`,
              borderRadius: 11, padding: 15, textAlign: 'center',
              transition: 'all .2s', position: 'relative',
            }}>
              {/* Delete */}
              {i >= 3 && (
                <button onClick={() => removeMetal(i)} style={{
                  position: 'absolute', top: 7, left: 7,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(255,77,106,.9)', border: 'none',
                  cursor: 'pointer', color: '#fff', fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>×</button>
              )}
              <div style={{ fontSize: 30, marginBottom: 8 }}>{m.ico}</div>
              <div style={{ fontWeight: 800, color: m.clr, marginBottom: 3, fontSize: 13.5 }}>{m.name}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 8 }}>{m.en}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 8 }}>{m.desc}</div>
              <span className={`badge ${m.bc}`}>{m.badge}</span>
            </div>
          ))}
        </div>
        <div className="info" style={{ marginTop: 10 }}>
          📏 حجم كل عينة: <strong>5cm × 3cm × 2mm</strong> — قِس السُمك في 5 نقاط
        </div>
      </div>

      {/* ══ SOLUTIONS ══ */}
      <div className="card red">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 800, color: 'var(--red)', fontSize: 13.5 }}>⚗️ المحاليل الكيمياوية</div>
          <button className="btn btn-red btn-sm" onClick={() => setShowAddSol(!showAddSol)}>➕ إضافة محلول</button>
        </div>

        {/* Add Solution Form */}
        {showAddSol && (
          <div style={{ background: 'var(--card)', borderRadius: 11, padding: 16, marginBottom: 14, border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--red)', marginBottom: 12 }}>➕ إضافة محلول جديد</div>
            <div className="g2">
              <div className="inp-g"><label>اسم المحلول</label><input value={newSol.name} onChange={e => setNewSol(p => ({ ...p, name: e.target.value }))} placeholder="H₂SO₄ — حمض الكبريتيك" /></div>
              <div className="inp-g"><label>التركيز</label><input value={newSol.conc} onChange={e => setNewSol(p => ({ ...p, conc: e.target.value }))} placeholder="1M" /></div>
              <div className="inp-g"><label>pH</label><input value={newSol.ph} onChange={e => setNewSol(p => ({ ...p, ph: e.target.value }))} placeholder="~1" /></div>
              <div className="inp-g"><label>الطبيعة</label><input value={newSol.nat} onChange={e => setNewSol(p => ({ ...p, nat: e.target.value }))} placeholder="حمضي قوي" /></div>
              <div className="inp-g"><label>التوافر</label><input value={newSol.av} onChange={e => setNewSol(p => ({ ...p, av: e.target.value }))} placeholder="محل كيمياوي" /></div>
              <div className="inp-g">
                <label>لون البطاقة</label>
                <select value={newSol.bc} onChange={e => setNewSol(p => ({ ...p, bc: e.target.value }))}>
                  <option value="badge-red">أحمر — حمضي</option>
                  <option value="badge-blue">أزرق — قاعدي</option>
                  <option value="badge-amber">برتقالي — محايد</option>
                  <option value="badge-green">أخضر — مرجعي</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-red btn-sm" onClick={saveSol}>💾 حفظ</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddSol(false)}>إلغاء</button>
            </div>
          </div>
        )}

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>{['المحلول', 'التركيز', 'pH', 'الطبيعة', 'التوافر', ''].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {solutions.map((s, i) => (
                <tr key={i}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.conc}</td>
                  <td>{s.ph}</td>
                  <td><span className={`badge ${s.bc}`}>{s.nat}</span></td>
                  <td>{s.av}</td>
                  <td>
                    {i >= 4 && (
                      <button onClick={() => removeSol(i)} style={{ background: 'rgba(255,77,106,.15)', border: 'none', color: 'var(--red)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}>حذف</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="g2">
        {/* ══ COATINGS ══ */}
        <div className="card purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 800, color: 'var(--purple)', fontSize: 13.5 }}>🛡️ الطلاءات الواقية</div>
            <button className="btn btn-purple btn-sm" onClick={() => setShowAddCoat(!showAddCoat)}>➕</button>
          </div>

          {showAddCoat && (
            <div style={{ background: 'var(--card)', borderRadius: 10, padding: 13, marginBottom: 12, border: '1px solid var(--border)' }}>
              <div className="g2">
                <div className="inp-g"><label>الرمز</label><input value={newCoat.ic} onChange={e => setNewCoat(p => ({ ...p, ic: e.target.value }))} placeholder="🎨" /></div>
                <div className="inp-g"><label>اسم الطلاء</label><input value={newCoat.name} onChange={e => setNewCoat(p => ({ ...p, name: e.target.value }))} placeholder="طلاء زيني" /></div>
                <div className="inp-g"><label>الفعالية %</label><input value={newCoat.eff} onChange={e => setNewCoat(p => ({ ...p, eff: e.target.value }))} placeholder="70-80%" /></div>
                <div className="inp-g">
                  <label>اللون</label>
                  <select value={newCoat.bc} onChange={e => setNewCoat(p => ({ ...p, bc: e.target.value }))}>
                    <option value="badge-green">أخضر</option>
                    <option value="badge-amber">برتقالي</option>
                    <option value="badge-red">أحمر</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-purple btn-sm" onClick={saveCoat}>💾 حفظ</button>
                <button className="btn btn-outline btn-sm" onClick={() => setShowAddCoat(false)}>إلغاء</button>
              </div>
            </div>
          )}

          {coatings.map((c, i) => (
            <div key={i} style={{
              padding: '8px 0', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, alignItems: 'center',
            }}>
              <span>{c.ic} <strong>{c.name}</strong></span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className={`badge ${c.bc}`}>{c.eff}</span>
                {i >= 4 && (
                  <button onClick={() => removeCoat(i)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 14 }}>×</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div className="card amber">
          <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 12, fontSize: 13.5 }}>
            🔬 الأدوات المطلوبة
          </div>
          {[
            ['✓', 'Micrometer بدقة 0.001mm',  'badge-green'],
            ['✓', '12 كوب زجاجي أو بلاستيكي', 'badge-green'],
            ['✓', 'قفازات ونظارات واقية',      'badge-green'],
            ['✓', 'دفتر تسجيل وكاميرا',        'badge-green'],
            ['!', 'ورق صنفرة 400-grit',        'badge-amber'],
          ].map(([s, t, bc]) => (
            <div key={t} style={{
              padding: '7px 0', borderBottom: '1px solid var(--border)',
              fontSize: 13, display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <span className={`badge ${bc}`}>{s}</span>{t}
            </div>
          ))}
        </div>
      </div>

      {/* Safety */}
      <div className="warning">
        <div className="wt">⚠️ تحذيرات السلامة المهمة</div>
        <p>
          • ارتدِ القفازات والنظارات الواقية دائماً<br />
          • اعمل في منطقة جيدة التهوية<br />
          • خفف المحاليل قبل التخلص منها<br />
          • اغسل الجلد فوراً بالماء لمدة 15 دقيقة عند التلامس مع HCl أو NaOH
        </p>
      </div>
    </div>
  )
}