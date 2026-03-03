// ── تكليفات السلسلة ──
// أضف التكليفات المُستخرجة من المجالس هنا

// نص تعريفي يظهر أعلى صفحة التكليفات
export const ASSIGNMENTS_INTRO = 'أضف وصفًا تعريفيًا للتكليفات هنا.';

// ── تكليفات مستمرة ──
// تكليفات مطلوبة طوال السلسلة
// كل تكليف يحتاج: id, text, detail, source, icon
//
// مثال:
// { id: 'ongoing-1', text: 'عنوان التكليف', detail: 'تفاصيل التكليف.', source: 'المجلس 1', icon: 'check_circle' },

export const ONGOING_ASSIGNMENTS = [];

// ── أقسام التكليفات ──
// تكليفات مُنظَّمة حسب النوع (كتابية، قرائية، عملية، إلخ)
// كل قسم يحتاج: id, title, icon, description, items[]
// كل تكليف داخل القسم يحتاج: id, text, detail, source
//
// مثال:
// {
//   id: 'writing',
//   title: 'تكليفات كتابية',
//   icon: 'edit_note',
//   description: 'تمارين كتابية للتأمل.',
//   items: [
//     { id: 'write-1', text: 'عنوان التكليف', detail: 'التفاصيل.', source: 'المجلس 1' },
//   ],
// },

export const ASSIGNMENT_SECTIONS = [];
