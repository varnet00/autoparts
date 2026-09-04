// מיון כלי הרכב: קודם סוג, ואז היצרנים הנפוצים בישראל לאותו סוג.
// מקור אמת אחד — השרת מגיש אותו, הממשק והטופס נשענים עליו,
// וכך רשימה לא נופלת מהסנכרון עם הבדיקות בצד השרת.
const VEHICLE_KINDS = [
  {
    id: 'car', label: 'רכב פרטי',
    makes: ['Toyota', 'Hyundai', 'Kia', 'Mazda', 'Skoda', 'Volkswagen', 'Nissan', 'Honda',
            'Mitsubishi', 'Renault', 'Peugeot', 'Citroën', 'Seat', 'Suzuki', 'Ford',
            'Chevrolet', 'Opel', 'Fiat', 'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Subaru', 'Tesla'],
  },
  {
    id: 'suv', label: 'רכב שטח וקרוסאובר',
    makes: ['Toyota', 'Hyundai', 'Kia', 'Mitsubishi', 'Jeep', 'Land Rover', 'Subaru', 'Nissan',
            'Mazda', 'Skoda', 'Volkswagen', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Suzuki'],
  },
  {
    id: 'van', label: 'מסחרי וואן',
    makes: ['Ford', 'Mercedes-Benz', 'Volkswagen', 'Renault', 'Peugeot', 'Citroën', 'Fiat',
            'Hyundai', 'Toyota', 'Nissan', 'Opel', 'Iveco'],
  },
  {
    id: 'truck', label: 'משאית',
    makes: ['Volvo', 'Scania', 'MAN', 'DAF', 'Iveco', 'Mercedes-Benz', 'Renault Trucks',
            'Isuzu', 'Hino', 'Tata'],
  },
  {
    id: 'bus', label: 'אוטובוס ומיניבוס',
    makes: ['Mercedes-Benz', 'MAN', 'Volvo', 'Scania', 'Iveco', 'Setra', 'Higer', 'Golden Dragon', 'Otokar'],
  },
  {
    id: 'moto', label: 'אופנוע וקטנוע',
    makes: ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW', 'KTM', 'Ducati', 'Piaggio',
            'Vespa', 'SYM', 'Kymco', 'Aprilia', 'Harley-Davidson'],
  },
  {
    id: 'atv', label: 'טרקטורון ורכב שטח',
    makes: ['Polaris', 'Can-Am', 'CFMoto', 'Yamaha', 'Honda', 'Kawasaki', 'Segway', 'Linhai'],
  },
  {
    id: 'tractor', label: 'טרקטור וציוד חקלאי',
    makes: ['John Deere', 'New Holland', 'Massey Ferguson', 'Kubota', 'Case IH',
            'Deutz-Fahr', 'Landini', 'Valtra', 'Claas'],
  },
  {
    id: 'forklift', label: 'מלגזה וציוד שינוע',
    makes: ['Toyota', 'Linde', 'Hyster', 'Still', 'Jungheinrich', 'Caterpillar', 'Komatsu', 'Doosan'],
  },
];

const KIND_IDS = new Set(VEHICLE_KINDS.map((k) => k.id));
const MAKES_BY_KIND = new Map(VEHICLE_KINDS.map((k) => [k.id, new Set(k.makes)]));

function isKind(id) {
  return KIND_IDS.has(id);
}

// יצרן תקף רק בתוך הסוג שלו: "John Deere" על רכב פרטי הוא טעות הקלדה,
// ואם לא נתפוס אותה כאן היא תתגלה רק כשקונה לא ימצא את החלק.
function isMakeOfKind(kind, make) {
  const set = MAKES_BY_KIND.get(kind);
  return Boolean(set && set.has(make));
}

module.exports = { VEHICLE_KINDS, isKind, isMakeOfKind };
