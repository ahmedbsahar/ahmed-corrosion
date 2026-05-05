export default function Materials() {
  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> المواد</div>
        <h2>المواد والتجهيز</h2>
        <p>العينات المعدنية، المحاليل الكيمياوية، الطلاءات والأدوات</p>
      </div>

      {/* Metals */}
      <div className="card blue">
        <div style={{ fontWeight: 800, color: 'var(--blue)', marginBottom: 14, fontSize: 13.5 }}>
          🔩 العينات المعدنية
        </div>
        <div className="g3">
          {[
            ['🔴', 'حديد (Fe)',     'Carbon Steel',   '#f87171', 'الأكثر شيوعاً في الصناعة. عرضة للصدأ والتآكل الكيمياوي.',       'مقاومة منخفضة',              'badge-red'],
            ['🟡', 'نحاس (Cu)',     'Copper',          '#fbbf24', 'مقاومة جيدة للتآكل. يُكوّن طبقة Cu₂O واقية طبيعية.',          'مقاومة متوسطة-عالية',        'badge-amber'],
            ['⚪', 'ألمنيوم (Al)', 'Aluminum Alloy',  '#60a5fa', 'خفيف الوزن. طبقة Al₂O₃ واقية طبيعية لكن حساس للأحماض.',       'حساس للأحماض والقواعد',      'badge-blue'],
          ].map(([ico, name, en, clr, desc, badge, bc]) => (
            <div key={name} style={{
              background: 'var(--card)', border: `1px solid ${clr}44`,
              borderRadius: 11, padding: 15, textAlign: 'center',
              transition: 'all .2s', cursor: 'default',
            }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>{ico}</div>
              <div style={{ fontWeight: 800, color: clr, marginBottom: 3, fontSize: 13.5 }}>{name}</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 8 }}>{en}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 8 }}>{desc}</div>
              <span className={`badge ${bc}`}>{badge}</span>
            </div>
          ))}
        </div>
        <div className="info" style={{ marginTop: 10 }}>
          📏 حجم كل عينة: <strong>5cm × 3cm × 2mm</strong> — قِس السُمك في 5 نقاط وخذ المتوسط كـ T₀
        </div>
      </div>

      {/* Solutions */}
      <div className="card red">
        <div style={{ fontWeight: 800, color: 'var(--red)', marginBottom: 14, fontSize: 13.5 }}>
          ⚗️ المحاليل الكيمياوية
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                {['المحلول', 'التركيز', 'pH', 'الطبيعة', 'التوافر'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['HCl — حمض الهيدروكلوريك', '1M',   '~0',  'حمضي قوي',        'badge-red',   'محل كيمياوي'],
                ['NaCl — كلوريد الصوديوم',  '3.5%', '~7',  'محايد',            'badge-amber', 'ملح الطعام'],
                ['NaOH — هيدروكسيد الصوديوم','1M',  '~14', 'قاعدي قوي',       'badge-blue',  'محل كيمياوي'],
                ['H₂O — ماء مقطر',          '100%', '7',   'محايد (مرجع)',     'badge-green', 'صيدلية'],
              ].map(([n, c, ph, nat, bc, av]) => (
                <tr key={n}>
                  <td><strong>{n}</strong></td>
                  <td>{c}</td>
                  <td>{ph}</td>
                  <td><span className={`badge ${bc}`}>{nat}</span></td>
                  <td>{av}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="g2">
        {/* Coatings */}
        <div className="card purple">
          <div style={{ fontWeight: 800, color: 'var(--purple)', marginBottom: 12, fontSize: 13.5 }}>
            🛡️ الطلاءات الواقية
          </div>
          {[
            ['🟫', 'إيبوكسي (Epoxy)',       '85-95%', 'badge-green'],
            ['🟠', 'دهان زيتي (Oil Paint)', '50-60%', 'badge-amber'],
            ['⬜', 'زيت خروع (Castor Oil)', '30-40%', 'badge-amber'],
            ['🔵', 'أكريليك (Acrylic)',     '40-55%', 'badge-amber'],
          ].map(([ic, n, eff, bc]) => (
            <div key={n} style={{
              padding: '8px 0',
              borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, alignItems: 'center',
            }}>
              <span>{ic} <strong>{n}</strong></span>
              <span className={`badge ${bc}`}>{eff}</span>
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
              padding: '7px 0',
              borderBottom: '1px solid var(--border)',
              fontSize: 13,
              display: 'flex', gap: 8, alignItems: 'center',
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
          • ارتدِ القفازات والنظارات الواقية دائماً عند التعامل مع المحاليل الكيمياوية<br />
          • اعمل في منطقة جيدة التهوية أو تحت شفاط المختبر<br />
          • خفف المحاليل قبل التخلص منها في مجرى الصرف<br />
          • اغسل الجلد فوراً بالماء لمدة 15 دقيقة عند التلامس مع HCl أو NaOH
        </p>
      </div>
    </div>
  )
}