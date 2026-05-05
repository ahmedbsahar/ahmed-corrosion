import { useState } from 'react'
import useStore from '../store'

export default function Report() {
  const { savedData, notify } = useStore()
  const [generated, setGenerated] = useState('')

  const generate = () => {
    const date = new Date().toLocaleDateString('ar-IQ', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
    const text = `دراسة التآكل وتطوير الطلاء الواقي للمعادن
══════════════════════════════════════════════
إعداد: أحمد بشار عقيل
قسم الهندسة الكيمياوية
التاريخ: ${date}

الملخص التنفيذي:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تناولت هذه الدراسة قياس معدل التآكل لثلاثة معادن
صناعية (حديد، نحاس، ألمنيوم) عند تعريضها لأربعة
محاليل كيمياوية مختلفة باستخدام Micrometer بدقة 0.001mm.

النتائج الرئيسية:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- أعلى CR: حديد في HCl = 8.03 mm/year (شديد جداً)
- أقل CR:  نحاس في NaCl = 1.34 mm/year (خفيف)
- أفضل طلاء: الإيبوكسي — فعالية حماية 95%
- ترتيب المقاومة: نحاس > ألمنيوم > حديد

${savedData.length ? `البيانات المحفوظة (${savedData.length} قياس):
${savedData.map((d, i) => `${i + 1}. ${d.metal} في ${d.sol}: CR = ${d.cr} mm/yr (${d.cls})`).join('\n')}` : ''}

التوصيات:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. استخدام النحاس في البيئات الحمضية والمالحة
2. طلاء الإيبوكسي إلزامي للحديد في HCl وNaCl
3. تجنّب الألمنيوم في البيئات الحمضية والقاعدية
4. فحص دوري كل 6 أشهر في الصناعات العراقية
5. توثيق صور قبل وبعد لكل تجربة

المراجع العلمية:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Fontana, M.G. (2005). Corrosion Engineering. McGraw-Hill.
- Jones, D.A. (1996). Principles and Prevention of Corrosion. Prentice Hall.
- ASM International. (2003). Corrosion: Understanding the Basics.`

    setGenerated(text)
    notify('✅ تم توليد التقرير')
  }

  const exportPDF = () => {
    if (!generated) generate()
    setTimeout(() => {
      notify('📄 افتح Ctrl+P واختر "حفظ كـ PDF"')
      setTimeout(() => window.print(), 600)
    }, 300)
  }

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> البيانات <span>›</span> التقرير</div>
        <h2>التقرير الأكاديمي</h2>
        <p>هيكل التقرير الكامل مع نصائح الكتابة الأكاديمية</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button className="btn btn-amber" onClick={exportPDF}>📄 تصدير PDF</button>
        <button className="btn btn-green btn-sm" onClick={generate}>✨ توليد تلقائي</button>
      </div>

      {/* Structure */}
      <div className="g2">
        <div>
          {[
            ['صفحة الغلاف',
             'اسم المشروع، أحمد بشار عقيل، القسم، المشرف، التاريخ.'],
            ['الملخص التنفيذي',
             '150-200 كلمة: الهدف + المنهجية + النتائج + التوصيات.'],
            ['المقدمة والأهداف',
             'أهمية التآكل (4% من GDP عالمياً)، الصناعة العراقية، أهداف المشروع.'],
            ['المراجعة النظرية',
             'أنواع التآكل، آلية التفاعل الكيمياوي، طرق الحماية، معادلة CR.'],
            ['المواد والطرق',
             'وصف المواد، الـ Micrometer، التصميم التجريبي، إجراءات السلامة.'],
          ].map(([t, d], i) => (
            <div key={t} style={{
              borderRight: '3px solid var(--amber)',
              padding: '11px 16px', marginBottom: 11,
              background: 'var(--card)', borderRadius: '0 11px 11px 0',
            }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--amber)', marginBottom: 4 }}>
                {i + 1}. {t}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.8 }}>{d}</div>
            </div>
          ))}
        </div>
        <div>
          {[
            ['النتائج والبيانات',
             'جداول البيانات الكاملة، الحسابات، الرسوم البيانية، الصور الموثّقة.'],
            ['المناقشة والتفسير',
             'تفسير النتائج كيمياوياً، مقارنة المعادن والمحاليل، أثر الطلاء.'],
            ['الاستنتاجات والتوصيات',
             'أفضل معدن وطلاء، التطبيقات في النفط العراقي، بحث مستقبلي.'],
            ['المراجع العلمية',
             'تنسيق APA/IEEE — Google Scholar: "corrosion rate steel acid"'],
          ].map(([t, d], i) => (
            <div key={t} style={{
              borderRight: '3px solid var(--amber)',
              padding: '11px 16px', marginBottom: 11,
              background: 'var(--card)', borderRadius: '0 11px 11px 0',
            }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--amber)', marginBottom: 4 }}>
                {i + 6}. {t}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.8 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Report */}
      {generated && (
        <div className="card amber">
          <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
            📄 التقرير المُولَّد تلقائياً
          </div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 12,
            lineHeight: 2, color: 'var(--text2)',
            whiteSpace: 'pre-wrap',
            background: 'var(--card)', borderRadius: 10, padding: 14,
          }}>
            {generated}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card green">
        <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 12, fontSize: 13.5 }}>
          💡 نصائح ذهبية للتقرير الأكاديمي
        </div>
        {[
          '📸 صوّر العينات قبل وبعد — الدليل البصري يقوي التقرير كثيراً',
          '📈 استخدم الرسوم البيانية من هذا النظام مباشرةً',
          '🔁 كرر كل تجربة 3 مرات (Triplicates) لتعزيز الموثوقية',
          '🌍 اربط النتائج بصناعة النفط والغاز في العراق',
          '📐 سجّل قيم الـ Micrometer فوراً ولا تعتمد على الذاكرة',
          '📚 أضف 10+ مراجع من مجلات علمية محكّمة (Scopus/Web of Science)',
        ].map(t => (
          <div key={t} style={{
            padding: '7px 0',
            borderBottom: '1px solid var(--border)',
            fontSize: 12.5, color: 'var(--text2)',
          }}>{t}</div>
        ))}
      </div>

      {/* Export Button */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          className="btn btn-amber"
          style={{ padding: '13px 32px', fontSize: 15 }}
          onClick={exportPDF}
        >
          📄 طباعة / تصدير PDF
        </button>
      </div>
    </div>
  )
}