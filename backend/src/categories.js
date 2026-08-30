// קטגוריות החלקים — לפי המערכות ברכב עצמו, בסדר שבו מכונאי חושב עליהן.
// מקור אמת אחד לשרת; הממשק מחזיק את אותה רשימה ומקבל ממנה גם את התוויות
// דרך GET /api/categories.
const PART_CATEGORIES = [
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
];

const CATEGORY_IDS = new Set(PART_CATEGORIES.map((c) => c.id));

// הקטגוריות הראשונות היו רשימה מקרית של מדפים (מסננים, שמנים, מצברים).
// המפה הזו מעבירה מלאי קיים למערכות הרכב בלי לאבד פוזיציות.
const LEGACY_CATEGORY_MAP = {
  filters: 'service',
  oil: 'service',
  oils: 'service',
  battery: 'electrical',
  batteries: 'electrical',
  lights: 'electrical',
  lighting: 'electrical',
};

function isCategory(id) {
  return CATEGORY_IDS.has(id);
}

module.exports = { PART_CATEGORIES, CATEGORY_IDS, LEGACY_CATEGORY_MAP, isCategory };
