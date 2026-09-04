// המדפים של החנות: ארבע מחלקות, ובכל אחת הקטגוריות שלה.
// מקור אמת אחד — הממשק מקבל את המבנה דרך GET /api/categories,
// והשרת מאמת מולו כל פוזיציה וכל סינון.
const DEPARTMENTS = [
  {
    id: 'parts',
    label: 'חלקים',
    hint: 'לפי הרכב והמערכת',
    // קטגוריות לפי המערכות ברכב, בסדר שבו מכונאי חושב עליהן
    categories: [
      { id: 'engine', label: 'מנוע' },
      { id: 'cooling', label: 'מערכת קירור' },
      { id: 'fuel', label: 'מערכת דלק' },
      { id: 'exhaust', label: 'מערכת פליטה' },
      { id: 'brakes', label: 'מערכת בלמים' },
      { id: 'transmission', label: 'תמסורת' },
      { id: 'suspension', label: 'מתלים' },
      { id: 'steering', label: 'היגוי' },
      { id: 'electrical', label: 'חשמל' },
      { id: 'climate', label: 'מיזוג ואוורור' },
      { id: 'body', label: 'מרכב' },
      { id: 'service', label: 'חלקי טיפול' },
      { id: 'other', label: 'אחר' },
    ],
  },
  {
    id: 'chemistry',
    label: 'כימיה לרכב',
    hint: 'שמנים ונוזלים',
    categories: [
      { id: 'oil_engine', label: 'שמני מנוע' },
      { id: 'oil_gear', label: 'שמני תמסורת' },
      { id: 'brake_fluid', label: 'נוזלי בלמים' },
      { id: 'car_care', label: 'קוסמטיקה לרכב' },
      { id: 'coolant', label: 'נוזל קירור' },
      { id: 'washer_fluid', label: 'נוזל שמשות' },
    ],
  },
  {
    id: 'accessories',
    label: 'אביזרים',
    hint: 'צמיגים, כלים ועוד',
    categories: [
      { id: 'accessories', label: 'אקססוריז' },
      { id: 'tyres', label: 'צמיגים' },
      { id: 'rims', label: 'חישוקים' },
      { id: 'repair', label: 'הכל לתיקון' },
      { id: 'literature', label: 'ספרות מקצועית' },
      { id: 'tools', label: 'כלי עבודה' },
    ],
  },
  {
    id: 'electronics',
    label: 'אלקטרוניקה',
    hint: 'מצברים, נורות, מולטימדיה',
    categories: [
      { id: 'batteries', label: 'מצברים' },
      { id: 'bulbs', label: 'נורות' },
      { id: 'dashcam', label: 'מצלמות דרך' },
      { id: 'fuses', label: 'נתיכים' },
      { id: 'navigation', label: 'ניווט' },
      { id: 'stereo', label: 'מערכות שמע' },
    ],
  },
];

const DEPARTMENT_IDS = new Set(DEPARTMENTS.map((d) => d.id));
const CATEGORY_IDS = new Set(DEPARTMENTS.flatMap((d) => d.categories.map((c) => c.id)));

// הקטגוריות הראשונות היו רשימה מקרית של מדפים (מסננים, שמנים, מצברים).
// המפה הזו מעבירה מלאי קיים למבנה החדש בלי לאבד פוזיציות.
const LEGACY_CATEGORY_MAP = {
  filters: 'service',
  oil: 'oil_engine',
  oils: 'oil_engine',
  battery: 'batteries',
  lights: 'bulbs',
  lighting: 'bulbs',
};

function isCategory(id) {
  return CATEGORY_IDS.has(id);
}

function isDepartment(id) {
  return DEPARTMENT_IDS.has(id);
}

// כל הקטגוריות של מחלקה — כך סינון לפי מחלקה הוא IN אחד
function categoryIdsOf(department) {
  const dep = DEPARTMENTS.find((d) => d.id === department);
  return dep ? dep.categories.map((c) => c.id) : [];
}

module.exports = {
  DEPARTMENTS, DEPARTMENT_IDS, CATEGORY_IDS, LEGACY_CATEGORY_MAP,
  isCategory, isDepartment, categoryIdsOf,
};
