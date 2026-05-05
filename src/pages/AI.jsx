import { useState } from 'react'
import { METALS, SOLUTIONS, AI_KNOWLEDGE } from '../utils/corrosion'
import useStore from '../store'

const QUICK_ANSWERS = {
  causes: `أسباب التآكل الكيمياوي في الحديد:

1️⃣ التفاعل مع الأكسجين:
   4Fe + 3O₂ → 2Fe₂O₃ (الصدأ)

2️⃣ التفاعل مع الأحماض:
   Fe + 2HCl → FeCl₂ + H₂↑

3️⃣ التآكل الكهروكيمياوي في وجود رطوبة وأملاح

4️⃣ الخلايا الجلفانية عند تلامس معدنين مختلفين

5️⃣ التآكل الإجهادي في مناطق الضغط الميكانيكي العالي

العوامل المعجّلة: درجة الحرارة، تركيز الأيونات، غياب الطبقة الواقية.`,

  epoxy: `آلية عمل الطلاء الإيبوكسي:

🛡️ الحماية الحاجزة (Barrier Protection):
- يمنع وصول O₂ → يوقف الأكسدة
- يمنع الرطوبة → يوقف التيار الكهروكيمياوي
- يوقف Cl⁻ وSO₄²⁻ → يُعطّل خلايا التآكل

⚗️ الخصائص الكيمياوية:
- مقاوم للأحماض والقواعد والمذيبات
- يلتصق بقوة بالسطح المعدني
- يملأ المسام والشقوق الدقيقة

📊 الفعالية المثبتة: 85-95% تخفيض في CR

⚠️ شرط النجاح: تنظيف السطح كاملاً قبل الطلاء.`,

  electro: `الفرق بين التآكل الكيميائي والكهروكيميائي:

🔴 التآكل الكيميائي:
- يحدث بغياب الرطوبة
- تفاعل مباشر بين المعدن والبيئة
- مثال: Fe + 2HCl → FeCl₂ + H₂↑

⚡ التآكل الكهروكيميائي:
- يحدث بوجود محلول إلكتروليتي
- أنود (أكسدة) + كاثود (اختزال)
- أسرع وأكثر خطورة
- الصدأ الشائع مثال كلاسيكي

📊 في مشروعك:
- NaCl وH₂O = كهروكيميائي بحت
- HCl = كيميائي + كهروكيميائي مزدوج`,

  cr: `خطوات حساب CR بالـ Micrometer:

المعادلة: CR = (T₀ − Tₙ) ÷ t × 8760

1. قِس T₀ في 5 نقاط — خذ المتوسط
2. اغمر العينة للمدة المحددة
3. أخرج، نظّف بالماء المقطر، جفّف
4. قِس Tₙ في نفس النقاط
5. احسب ΔT = T₀ − Tₙ
6. CR = ΔT ÷ t × 8760

مثال عملي:
T₀ = 2.000mm | T₇₂ = 1.955mm | t = 72h
ΔT = 0.045mm
CR = 0.045 ÷ 72 × 8760 = 5.48 mm/yr
→ تصنيف: شديد 🟠`,

  pitting: `التآكل النقطي (Pitting Corrosion):

🕳️ التعريف:
تآكل يتركز في نقاط صغيرة محددة بدلاً من
أن يكون موحداً. خطير جداً لأنه يُضعف المعدن محلياً.

🔍 الآلية:
1. أيون Cl⁻ يخترق طبقة الأكسيد في نقطة ضعيفة
2. تتشكّل خلية كهروكيمياوية محلية صغيرة
3. المنطقة المتآكلة تصبح أنوداً
4. يتعمق الثقب بسرعة رغم صغر حجمه

⚠️ الخطورة:
الثقوب صعبة الكشف بالعين المجردة وتسبب
فشلاً مفاجئاً في الأنابيب والخزانات.

🛡️ الوقاية:
- فولاذ مقاوم للصدأ عالي Cr
- طلاء إيبوكسي كثيف ومتصل`,
}

export default function AI() {
  const { notify } = useStore()
  const [form, setForm] = useState({ metal: 'fe', sol: 'hcl', cr: '', t0: '', notes: '' })
  const [response, setResponse]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [quickAns, setQuickAns]   = useState('')
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const runAI = () => {
    setLoading(true)
    setResponse('')
    setTimeout(() => {
      const rule   = AI_KNOWLEDGE[form.metal]?.[form.sol]
      const mName  = METALS[form.metal]
      const sName  = SOLUTIONS[form.sol]?.split(' ')[0]
      const cr     = +form.cr
      const crStr  = form.cr ? form.cr + ' mm/year' : 'لم يُدخَل'
      const risk   = rule?.risk || '—'
      const crComp = !cr ? '—' : cr < 2 ? '✅ طبيعي — ضمن النطاق المقبول' :
                     cr < 5 ? '⚠️ متوسط — يتوافق مع الأدبيات العلمية' :
                     cr < 10 ? '🔴 شديد — مطابق للدراسات المرجعية' :
                     '⛔ حرج — استجابة فورية مطلوبة'
      const life   = cr ? (9 / cr).toFixed(1) + ' سنة (لسُمك 10mm)' : '—'

      const text = `🔬 تحليل شامل للتجربة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
المعدن: ${mName}  |  المحلول: ${sName}
معدل التآكل: ${crStr}  |  الخطورة: ${risk}

📚 التفسير الكيمياوي:
${rule?.exp || 'لا تتوفر بيانات كافية لهذه التجربة'}

⚙️ التوصية العملية:
${rule?.act || 'أدخل بيانات كاملة للحصول على توصية دقيقة'}

📊 مقارنة مع الأدبيات العلمية:
${crComp}

⏳ العمر الافتراضي التقديري:
${life}
${form.notes ? '\n📝 ملاحظاتك الميدانية:\n' + form.notes : ''}
💡 اقتراح للتطوير:
قارن هذه النتيجة بالمعادن الأخرى في نفس المحلول
لاستخلاص ترتيب تصاعدي للمقاومة.`

      setResponse(text)
      setLoading(false)
      notify('🤖 اكتمل التحليل!')
    }, 1600)
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> الذكاء الاصطناعي <span>›</span> تحليل</div>
        <h2>تحليل بالذكاء الاصطناعي</h2>
        <p>تفسير علمي كامل مبني على قواعد المعرفة الكيمياوية</p>
      </div>

      {/* Input */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          🤖 إدخال بيانات التحليل
        </div>
        <div className="g2">
          <div className="inp-g">
            <label>المعدن</label>
            <select value={form.metal} onChange={e => upd('metal', e.target.value)}>
              {Object.entries(METALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="inp-g">
            <label>المحلول</label>
            <select value={form.sol} onChange={e => upd('sol', e.target.value)}>
              {Object.entries(SOLUTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="inp-g">
            <label>معدل التآكل CR (mm/year)</label>
            <input
              type="number" value={form.cr}
              placeholder="مثال: 5.48" step="0.01"
              onChange={e => upd('cr', e.target.value)}
            />
          </div>
          <div className="inp-g">
            <label>السُمك الأولي T₀ (mm)</label>
            <input
              type="number" value={form.t0}
              placeholder="2.000" step="0.001"
              onChange={e => upd('t0', e.target.value)}
            />
          </div>
        </div>
        <div className="inp-g">
          <label>ملاحظات ميدانية (اختياري)</label>
          <textarea
            value={form.notes}
            onChange={e => upd('notes', e.target.value)}
            placeholder="مثال: ظهر تغير لوني واضح، تشكّل رواسب بنية..."
          />
        </div>
        <button
          className="btn btn-amber btn-full"
          style={{ fontSize: 14, padding: 12 }}
          onClick={runAI}
          disabled={loading}
        >
          {loading ? '🤖 جاري التحليل...' : '🤖 تحليل ذكي شامل للنتائج'}
        </button>

        {/* Response */}
        {response && (
          <div style={{ marginTop: 16 }}>
            <div style={{
              background: 'linear-gradient(135deg,rgba(157,111,255,.08),rgba(61,142,240,.05))',
              border: '1.5px solid rgba(157,111,255,.25)',
              borderRadius: 13, padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11,
                  background: 'linear-gradient(135deg,var(--purple),var(--blue))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--purple)' }}>
                    تحليل الذكاء الاصطناعي
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>
                    تفسير كيمياوي علمي متقدم
                  </div>
                </div>
              </div>
              <div style={{
                background: 'var(--card)', borderRadius: 11,
                padding: 14, fontSize: 12, color: 'var(--text)',
                lineHeight: 2, whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font)',
              }}>
                {response}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="card blue">
        <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
          💬 أسئلة علمية سريعة
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
          {[
            ['causes',  '🔬 أسباب تآكل الحديد'],
            ['epoxy',   '🛡️ آلية الإيبوكسي'],
            ['electro', '⚡ كيمياوي vs كهروكيمياوي'],
            ['cr',      '📐 كيفية حساب CR'],
            ['pitting', '🕳️ التآكل النقطي'],
          ].map(([k, l]) => (
            <button
              key={k}
              className="btn btn-outline btn-sm"
              onClick={() => setQuickAns(QUICK_ANSWERS[k])}
            >
              {l}
            </button>
          ))}
        </div>
        {quickAns && (
          <div style={{
            background: 'var(--card)', borderRadius: 11,
            padding: 14, fontSize: 12, color: 'var(--text)',
            lineHeight: 2, whiteSpace: 'pre-wrap',
          }}>
            {quickAns}
          </div>
        )}
      </div>

      {/* AI Knowledge Info */}
      <div className="info">
        ℹ️ <strong style={{ color: 'var(--amber)' }}>ملاحظة:</strong> هذا النظام يعمل بقواعد معرفة
        كيمياوية مبرمجة مسبقاً — ليس اتصالاً بالإنترنت. النتائج مبنية على المعادلات الكيمياوية
        الأكاديمية المعتمدة.
      </div>
    </div>
  )
}
