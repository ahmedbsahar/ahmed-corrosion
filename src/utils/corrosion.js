// ══════════════════════════════
//  حسابات التآكل الكيمياوية
// ══════════════════════════════

export const METALS = {
  fe: 'حديد (Fe)',
  cu: 'نحاس (Cu)',
  al: 'ألمنيوم (Al)',
}

export const SOLUTIONS = {
  hcl:  'HCl — حمضي قوي',
  nacl: 'NaCl — ملحي محايد',
  naoh: 'NaOH — قاعدي قوي',
  h2o:  'H₂O — ماء مقطر',
}

export const COATINGS = {
  none:    'لا يوجد',
  epoxy:   'إيبوكسي',
  oil:     'دهان زيتي',
  acrylic: 'أكريليك',
  castor:  'زيت خروع',
}

// ── حساب معدل التآكل ──
export function calcCR(t0, tn, hours) {
  if (!t0 || !tn || !hours) return null
  if (tn > t0) return null
  const delta = +(t0 - tn).toFixed(4)
  const cr    = +((t0 - tn) / hours * 8760).toFixed(3)
  return { delta, cr }
}

// ── تصنيف معدل التآكل ──
export function classifyCR(cr) {
  const v = parseFloat(cr)
  if (v < 2)  return { label: 'خفيف',       color: '#00c896', pct: 15, badge: 'badge-green'  }
  if (v < 5)  return { label: 'متوسط',      color: '#f5a623', pct: 45, badge: 'badge-amber'  }
  if (v < 10) return { label: 'شديد',       color: '#ff7a35', pct: 75, badge: 'badge-orange' }
  return            { label: 'شديد جداً',   color: '#ff4d6a', pct: 100,badge: 'badge-red'    }
}

// ── حساب العمر الافتراضي ──
export function calcLifetime(t0, minT, cr) {
  if (!t0 || !cr) return null
  const life     = +((t0 - minT) / cr).toFixed(2)
  const halfLife = +((t0 - minT) / 2 / cr).toFixed(2)
  const loss5    = +(cr * 5).toFixed(2)
  const loss10   = +(cr * 10).toFixed(2)
  return { life, halfLife, loss5, loss10 }
}

// ── حساب نسبة الحماية ──
export function calcProtection(base, coated) {
  if (!base || !coated) return null
  const pct       = +((base - coated) / base * 100).toFixed(1)
  const reduction = +(base - coated).toFixed(2)
  return { pct, reduction }
}

// ── التحليل الإحصائي ──
export function calcStats(values) {
  if (!values || values.length < 2) return null
  const n    = values.length
  const mean = values.reduce((a, b) => a + b, 0) / n
  const variance = values.map(v => (v - mean) ** 2).reduce((a, b) => a + b, 0) / (n - 1)
  const std  = Math.sqrt(variance)
  const sem  = std / Math.sqrt(n)
  const min  = Math.min(...values)
  const max  = Math.max(...values)
  const cv   = +((std / mean) * 100).toFixed(1)
  const quality = std < 0.002 ? '✅ ممتاز' : std < 0.005 ? '⚠️ مقبول' : '❌ أعد القياس'
  return {
    n,
    mean:   +mean.toFixed(4),
    std:    +std.toFixed(4),
    sem:    +sem.toFixed(4),
    min:    +min.toFixed(3),
    max:    +max.toFixed(3),
    range:  +(max - min).toFixed(3),
    cv,
    quality,
    ci95l:  +(mean - 1.96 * sem).toFixed(3),
    ci95h:  +(mean + 1.96 * sem).toFixed(3),
  }
}

// ── قاعدة معرفة التآكل (AI) ──
export const AI_KNOWLEDGE = {
  fe: {
    hcl: {
      exp: `الحديد في HCl يتفاعل بسرعة:\nFe + 2HCl → FeCl₂ + H₂↑\n\nأيونات H⁺ تذوّب طبقة الأكسيد وتهاجم الحديد مباشرةً.\nهذا تآكل كيمياوي وكهروكيمياوي مزدوج — الأخطر.`,
      risk: 'شديد جداً 🔴',
      act: 'استخدم الفولاذ المقاوم للصدأ 316L أو طلاء إيبوكسي سميك. تجنّب الحديد الكربوني في البيئات الحمضية.',
    },
    nacl: {
      exp: `التآكل الكهروكيمياوي في NaCl:\nأيونات Cl⁻ تخترق طبقة الأكسيد وتُسرّع التفاعل الأنودي.\nيحدث تآكل نقطي (Pitting) في المناطق الضعيفة.`,
      risk: 'شديد 🟠',
      act: 'استخدم مثبطات التآكل أو طلاء إيبوكسي. المراقبة الدورية ضرورية.',
    },
    naoh: {
      exp: `الحديد في القاعدة يُكوّن Fe(OH)₂ ثم Fe(OH)₃\nتشكّل طبقة واقية نسبية تُبطّئ التآكل.`,
      risk: 'متوسط 🟡',
      act: 'البيئة القاعدية أقل ضرراً للحديد. مراقبة دورية مع طلاء خفيف.',
    },
    h2o: {
      exp: `الماء المقطر خالٍ من الأيونات المحفّزة.\nالتآكل بطيء جداً ناتج عن ذوبان O₂ في الماء.`,
      risk: 'خفيف 🟢',
      act: 'آمن نسبياً. المشكلة في مياه الصنبور التي تحتوي Cl⁻ وSO₄²⁻.',
    },
  },
  cu: {
    hcl: {
      exp: `النحاس في HCl:\nCu + 2HCl → CuCl₂ + H₂↑\nأبطأ من الحديد. Cu أعلى في سلسلة الجهود الكهروكيميائية.`,
      risk: 'متوسط 🟡',
      act: 'النحاس أفضل من الحديد في الأحماض الخفيفة. للحماية الكاملة استخدم التيتانيوم.',
    },
    nacl: {
      exp: `النحاس مقاوم جداً في NaCl.\nيُكوّن طبقة Cu₂O واقية ذاتية (Patina).\nمثالي للتطبيقات البحرية.`,
      risk: 'خفيف 🟢',
      act: 'ممتاز للاستخدام البحري وشبكات المياه المالحة بدون طلاء.',
    },
    naoh: {
      exp: `النحاس شبه محايد في القواعد.\nلا يتفاعل تقريباً مع NaOH في التركيزات الاعتيادية.`,
      risk: 'خفيف 🟢',
      act: 'النحاس خيار ممتاز في البيئات القاعدية.',
    },
    h2o: {
      exp: `النحاس شبه محايد في الماء المقطر.\nيُستخدم عالمياً في أنابيب مياه الشرب لهذا السبب.`,
      risk: 'خفيف 🟢',
      act: 'آمن جداً في الماء النقي.',
    },
  },
  al: {
    hcl: {
      exp: `الألمنيوم في HCl:\nAl₂O₃ + 6HCl → 2AlCl₃ + 3H₂O\nثم: 2Al + 6HCl → 2AlCl₃ + 3H₂↑\nالحمض يُذيب الطبقة الواقية أولاً.`,
      risk: 'شديد 🟠',
      act: 'تجنّب الألمنيوم في البيئات الحمضية. استخدم PP أو PVDF.',
    },
    nacl: {
      exp: `الألمنيوم مقاوم نسبياً في NaCl لكن\nيحدث تآكل نقطي (Pitting) بسبب Cl⁻\nالتي تخترق طبقة Al₂O₃ في نقاط محددة.`,
      risk: 'متوسط 🟡',
      act: 'استخدم الألمنيوم المعالج أنودياً (Anodized) في البيئات البحرية.',
    },
    naoh: {
      exp: `الألمنيوم يذوب في القواعد القوية:\nAl + NaOH + H₂O → NaAlO₂ + 1.5H₂↑\nمعدن مُذبذب (Amphoteric) يتآكل في البيئتين.`,
      risk: 'شديد 🟠',
      act: 'لا تستخدم الألمنيوم في البيئات القاعدية إطلاقاً.',
    },
    h2o: {
      exp: `الألمنيوم مقاوم جداً في الماء المقطر.\nطبقة Al₂O₃ تتجدد ذاتياً عند التعرض للأكسجين.`,
      risk: 'خفيف 🟢',
      act: 'ممتاز في الماء النقي والبيئات المحايدة.',
    },
  },
}

// ── بيانات مرجعية للرسوم البيانية ──
export const REFERENCE_DATA = [
  { metal: 'حديد', sol: 'HCl',  t0: 2.000, tn: 1.934, cr: 8.03, color: '#ff4d6a' },
  { metal: 'حديد', sol: 'NaCl', t0: 2.000, tn: 1.955, cr: 5.48, color: '#ff7a35' },
  { metal: 'حديد', sol: 'NaOH', t0: 2.000, tn: 1.982, cr: 2.19, color: '#f5a623' },
  { metal: 'حديد', sol: 'H₂O',  t0: 2.000, tn: 1.991, cr: 1.10, color: '#00c896' },
  { metal: 'نحاس', sol: 'HCl',  t0: 2.000, tn: 1.974, cr: 3.16, color: '#f5a623' },
  { metal: 'نحاس', sol: 'NaCl', t0: 2.000, tn: 1.989, cr: 1.34, color: '#00c896' },
  { metal: 'ألمنيوم', sol: 'HCl',  t0: 2.000, tn: 1.961, cr: 4.75, color: '#ff7a35' },
  { metal: 'ألمنيوم', sol: 'NaOH', t0: 2.000, tn: 1.958, cr: 5.11, color: '#ff7a35' },
]

export const COATING_DATA = [
  { name: 'إيبوكسي',    cr: 0.40, protection: 95, color: '#00c896' },
  { name: 'أكريليك',    cr: 3.61, protection: 55, color: '#f5a623' },
  { name: 'زيتي',       cr: 3.21, protection: 60, color: '#f59e0b' },
  { name: 'زيت خروع',   cr: 4.82, protection: 40, color: '#ff7a35' },
  { name: 'بدون طلاء',  cr: 8.03, protection: 0,  color: '#ff4d6a' },
]