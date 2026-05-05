import useStore from '../store'

const STEPS_DATA = [
  ['تحضير العينات المعدنية',
   'قُص كل معدن بقياس 5×3cm. صنفر السطح بورق 400-grit. نظّف بالكحول الإيثيلي. رقّم كل عينة. صوّر قبل البدء.'],
  ['القياس الأولي T₀ بالـ Micrometer',
   'قِس السُمك في 5 نقاط مختلفة. احسب المتوسط = T₀. سجّل فوراً — هذه أهم خطوة في التجربة!'],
  ['تحضير المحاليل وبدء التغمير',
   'جهّز 12 كوباً منفصلاً. أضف المحاليل المحددة. اغمر عينة واحدة في كل كوب. سجّل وقت البدء بدقة.'],
  ['قياس 24h — T₂₄',
   'أخرج العينة بعد 24 ساعة. نظّفها بالماء المقطر ثم جففها جيداً. قِس السُمك في نفس النقاط الخمس.'],
  ['قياس 48h — T₄₈',
   'نفس الخطوة للمجموعة الثانية بعد 48 ساعة. لاحظ وسجّل أي تغيرات لونية أو تشكّل رواسب.'],
  ['قياس 72h — T₇₂ وحساب CR',
   'نفس الخطوة للمجموعة الثالثة. احسب CR باستخدام الحاسبة. قارن النتائج.'],
  ['تجربة الطلاء الواقي',
   'خذ عينات حديد جديدة. طلِّ كل واحدة بطلاء مختلف. انتظر 24h للجفاف. اغمرها في HCl لمدة 72h.'],
  ['التحليل وكتابة التقرير',
   'أدخل نتائجك في تبويب الذكاء الاصطناعي. احصل على تحليل علمي كامل. صدّر التقرير PDF.'],
]

export default function Steps() {
  const { steps, toggleStep, notify } = useStore()
  const done = steps.filter(Boolean).length

  const handleToggle = (i) => {
    toggleStep(i)
    if (!steps[i]) notify('✅ تم إنجاز: ' + STEPS_DATA[i][0])
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> التجربة <span>›</span> الخطوات</div>
        <h2>خطوات التجربة</h2>
        <p>اضغط على كل خطوة لتعليمها كمنجزة وتتبع تقدمك</p>
      </div>

      {/* Schedule */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          📅 جدول سير التجربة — 5 أيام
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                {['اليوم', 'النشاط', 'الوقت المتوقع'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['اليوم 1',        'تحضير العينات، قياس T₀، بدء التغمير',     '3-4 ساعات'],
                ['اليوم 2 (24h)',  'قياس T₂₄ — إخراج المجموعة الأولى',        '1-2 ساعة'],
                ['اليوم 3 (48h)',  'قياس T₄₈',                                 '1-2 ساعة'],
                ['اليوم 4 (72h)',  'قياس T₇₂، حساب CR',                        '1-2 ساعة'],
                ['اليوم 5',        'تجربة الطلاء + التحليل + التقرير',         '3-4 ساعات'],
              ].map(([d, a, t]) => (
                <tr key={d}>
                  <td style={{ color: 'var(--amber)', fontWeight: 700 }}>{d}</td>
                  <td>{a}</td>
                  <td><span className="badge badge-amber">{t}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Steps List */}
      <div className="card green">
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 14,
        }}>
          <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 13.5 }}>
            ✅ الخطوات — اضغط لتعليم كمنجزة
          </div>
          <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>
            {done} / 8
          </span>
        </div>

        {STEPS_DATA.map(([title, desc], i) => (
          <div
            key={i}
            onClick={() => handleToggle(i)}
            style={{
              display: 'flex', gap: 13, alignItems: 'flex-start',
              padding: '13px 15px',
              background: steps[i] ? 'rgba(0,200,150,.04)' : 'var(--card)',
              borderRadius: 11, marginBottom: 9,
              border: `1px solid ${steps[i] ? 'rgba(0,200,150,.45)' : 'var(--border)'}`,
              cursor: 'pointer', transition: 'all .18s',
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: steps[i] ? 'var(--green)' : 'var(--amber)',
              color: steps[i] ? '#fff' : '#000',
              fontWeight: 900, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: '.2s',
            }}>
              {steps[i] ? '✓' : i + 1}
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>{desc}</div>
            </div>
          </div>
        ))}

        {/* Progress */}
        <div style={{ marginTop: 12 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 12, color: 'var(--muted)', marginBottom: 5,
          }}>
            <span>التقدم الكلي</span>
            <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{done}/8</span>
          </div>
          <div className="prog">
            <div className="prog-bar" style={{ width: `${(done / 8) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Micrometer Guide */}
      <div className="info">
        📏 <strong style={{ color: 'var(--amber)' }}>كيفية قراءة الـ Micrometer: </strong>
        Sleeve = mm كاملة + خط إضافي = +0.5mm + Thimble × 0.01mm
        <br />
        <strong>مثال عملي: 5.00 + 0.88 = 5.88mm ✓</strong>
      </div>
    </div>
  )
}