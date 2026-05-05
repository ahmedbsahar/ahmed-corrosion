export default function Shortcuts() {
  const shortcuts = [
    ['Ctrl + B', 'فتح / إغلاق القائمة الجانبية'],
    ['Ctrl + D', 'تبديل المظهر الداكن / الفاتح'],
    ['Ctrl + T', 'الانتقال إلى المؤقت'],
    ['Ctrl + P', 'تصدير PDF / طباعة'],
    ['Ctrl + K', 'الانتقال إلى حاسبة التآكل'],
    ['Ctrl + G', 'الانتقال إلى الرسوم البيانية'],
    ['Ctrl + I', 'الانتقال إلى الذكاء الاصطناعي'],
    ['F11',      'ملء الشاشة / الخروج منه'],
  ]

  return (
    <div>
      <div className="ph">
        <div className="breadcrumb">🏠 <span>›</span> النظام <span>›</span> الاختصارات</div>
        <h2>اختصارات لوحة المفاتيح</h2>
        <p>تسريع الوصول إلى وظائف النظام بضغطة مفاتيح</p>
      </div>

      <div className="card amber">
        <div style={{ fontWeight: 800, color: 'var(--amber)', marginBottom: 14, fontSize: 13.5 }}>
          ⌨️ الاختصارات الأساسية
        </div>
        {shortcuts.map(([key, label]) => (
          <div key={key} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
            borderBottom: '1px solid var(--border)',
            fontSize: 12.5,
          }}>
            <span style={{ color: 'var(--text2)' }}>{label}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {key.split(' + ').map((k, i) => (
                <span key={i} style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border2)',
                  borderRadius: 6, padding: '2px 8px',
                  fontFamily: 'var(--mono)',
                  fontSize: 11, fontWeight: 700,
                  color: 'var(--amber)',
                }}>
                  {k}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="info">
        💡 الاختصارات تعمل في أي صفحة من صفحات النظام.
      </div>
    </div>
  )
}