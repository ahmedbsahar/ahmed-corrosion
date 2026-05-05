export default function Overview() {
  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> نظرة عامة</div>
        <h2>نظرة عامة على المشروع</h2>
        <p>هدف البحث والأهمية العلمية والمتغيرات التجريبية</p>
      </div>

      {/* Goal */}
      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 12, fontSize: 13.5 }}>
          🎯 هدف المشروع
        </div>
        <p style={{ color: 'var(--text2)', lineHeight: 2, fontSize: 13.5 }}>
          دراسة معدل التآكل في ثلاثة معادن{' '}
          <strong style={{ color: 'var(--amber)' }}>حديد، نحاس، ألمنيوم</strong>{' '}
          عند تعريضها لأربعة محاليل كيمياوية مختلفة، مع تطوير وتقييم طلاءات واقية
          باستخدام الـ Micrometer بدقة{' '}
          <strong style={{ color: 'var(--amber)' }}>0.001mm</strong>.
          المشروع يُوفر بيانات قابلة للتحليل الإحصائي ويُساهم في فهم ظاهرة
          التآكل في الصناعات العراقية.
        </p>
      </div>

      <div className="g2">
        {/* Importance */}
        <div className="card green">
          <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 12, fontSize: 13.5 }}>
            ✅ أهمية المشروع
          </div>
          <ul style={{ listStyle: 'none', color: 'var(--text2)', fontSize: 13, lineHeight: 2.4 }}>
            {[
              'مشكلة حقيقية في صناعة النفط العراقية',
              'توفير ملايين الدولارات في الصيانة',
              'حماية البيئة من التسربات الكيمياوية',
              'تطبيق عملي لمواد الهندسة الكيمياوية',
              'نتائج قابلة للتحليل الإحصائي الدقيق',
              'ربط مباشر بالصناعات المحلية العراقية',
            ].map(s => <li key={s}>◆ {s}</li>)}
          </ul>
        </div>

        {/* Variables */}
        <div className="card blue">
          <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 12, fontSize: 13.5 }}>
            📐 المتغيرات التجريبية
          </div>
          <div style={{ fontSize: 13, lineHeight: 2.5, color: 'var(--text2)' }}>
            {[
              ['المستقل',    'نوع المعدن + نوع المحلول'],
              ['التابع',     'سُمك العينة (mm)'],
              ['المحسوب',    'معدل التآكل (mm/year)'],
              ['الضابط',     'درجة الحرارة، الزمن'],
              ['الأداة',     'Micrometer ±0.001mm'],
              ['التكرارات',  '3 مرات لكل تجربة'],
            ].map(([k, v]) => (
              <div key={k}>
                <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{k}: </span>{v}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="formula">
        <div className="f">CR (mm/year) = (T₀ − Tₙ) ÷ t × 8760</div>
        <div className="fd">
          T₀ = السُمك الأولي | Tₙ = السُمك النهائي | t = الزمن بالساعات | 8760 = ساعات السنة
        </div>
      </div>

      {/* Corrosion Types */}
      <div className="card">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          📚 أنواع التآكل
        </div>
        <div className="g3">
          {[
            ['⚡', 'تآكل كهروكيمياوي', 'var(--amber)',
              'يحدث في وجود محلول إلكتروليتي. أنود (أكسدة) + كاثود (اختزال). الأكثر شيوعاً في الصناعة.'],
            ['🧪', 'تآكل كيمياوي', 'var(--blue)',
              'تفاعل مباشر مع الأحماض أو الغازات. مثال: Fe + 2HCl → FeCl₂ + H₂↑'],
            ['🕳️', 'تآكل نقطي (Pitting)', 'var(--green)',
              'تمركز التآكل في نقاط محددة. خطير لأنه يُضعف المعدن محلياً. شائع في الألمنيوم.'],
          ].map(([icon, title, clr, desc]) => (
            <div key={title} style={{
              background: 'var(--card)', borderRadius: 11,
              padding: 14, border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 700, color: clr, marginBottom: 6, fontSize: 13 }}>{title}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chemical Reactions */}
      <div className="card red">
        <div style={{ fontWeight: 800, color: 'var(--red)', marginBottom: 14, fontSize: 13.5 }}>
          ⚗️ التفاعلات الكيمياوية الأساسية
        </div>
        <div className="g2">
          {[
            ['الحديد في HCl',   'Fe + 2HCl → FeCl₂ + H₂↑',          'تآكل سريع جداً'],
            ['الحديد في H₂O',   '4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃',      'الصدأ العادي'],
            ['الألمنيوم في NaOH','Al + NaOH + H₂O → NaAlO₂ + H₂↑',  'ذوبان كامل'],
            ['الألمنيوم في HCl', '2Al + 6HCl → 2AlCl₃ + 3H₂↑',      'تآكل سريع'],
          ].map(([title, eq, note]) => (
            <div key={title} style={{
              background: 'var(--card)', borderRadius: 11,
              padding: '12px 14px', border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>{title}</div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 12,
                color: 'var(--amber)', direction: 'ltr', marginBottom: 5,
              }}>{eq}</div>
              <div style={{ fontSize: 10.5, color: 'var(--red)' }}>{note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}