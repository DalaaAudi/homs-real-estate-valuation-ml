// Form defaults, option lists and field rules for the price predictor.
//
// Every categorical `value` below is sent to Flask as-is, so it must match the
// server's allowed values character for character. Labels are display-only.

// The 16 inputs sent to POST /api/predict (booleans stay booleans).
export const INITIAL_FORM = {
  location: '',
  total_area: '',
  net_area: '',
  rooms_count: '',
  bathrooms_count: '',
  halls_count: '',
  floor_num: '',
  building_age: '',
  heating_type: '',
  house_condition: '',
  legal_status: '',
  near_hospital: false,
  near_market: false,
  has_elevator: false,
  has_parking: false,
  is_furnished: false,
};

// Section 1 — location & area (the district select is rendered separately).
export const AREA_FIELDS = [
  { name: 'total_area', min: 20, max: 1000, required: true, labelAr: 'المساحة الإجمالية (م²)', labelEn: 'Total Area', placeholderAr: 'مثال: 120', placeholderEn: 'e.g. 120' },
  { name: 'net_area', min: 15, max: 1000, required: true, labelAr: 'المساحة الصافية (م²)', labelEn: 'Net Area', placeholderAr: 'مثال: 100', placeholderEn: 'e.g. 100' },
  { name: 'rooms_count', min: 1, max: 10, required: false, labelAr: 'عدد الغرف', labelEn: 'Rooms', placeholderAr: 'مثال: 3', placeholderEn: 'e.g. 3' },
];

// Section 2 — building details.
export const BUILDING_FIELDS = [
  { name: 'bathrooms_count', min: 1, max: 5, required: false, labelAr: 'الحمامات', labelEn: 'Bathrooms', placeholderAr: 'مثال: 1', placeholderEn: 'e.g. 1' },
  { name: 'halls_count', min: 0, max: 5, required: false, labelAr: 'الصالات', labelEn: 'Halls', placeholderAr: 'مثال: 1', placeholderEn: 'e.g. 1' },
  { name: 'floor_num', min: -3, max: 15, required: false, labelAr: 'الطابق', labelEn: 'Floor', placeholderAr: '0 للأرضي', placeholderEn: '0 = ground' },
  { name: 'building_age', min: 0, max: 100, required: false, labelAr: 'عمر البناء', labelEn: 'Building Age', placeholderAr: 'مثال: 5', placeholderEn: 'e.g. 5' },
];

// Single source of truth for numeric validation (see validatePredictorForm).
export const NUMERIC_FIELDS = [...AREA_FIELDS, ...BUILDING_FIELDS].map(({ name, min, max }) => ({ name, min, max }));

// Selects that start on a blank option; leaving them blank blocks submission.
export const SELECT_FIELDS = ['heating_type', 'house_condition', 'legal_status'];

// Section 3 — values match the Flask server exactly.
export const HEATING_OPTIONS = [
  { value: 'لا يوجد', labelAr: 'بدون تدفئة', labelEn: 'None' },
  { value: 'تدفئة ديزل', labelAr: 'تدفئة ديزل', labelEn: 'Diesel' },
  { value: 'تدفئة مركزية', labelAr: 'تدفئة مركزية', labelEn: 'Central' },
];

export const CONDITION_OPTIONS = [
  { value: 'مسكون من صاحبه', labelAr: 'مسكون من صاحبه', labelEn: 'Occupied' },
  { value: 'فارغ', labelAr: 'فارغ', labelEn: 'Vacant' },
  { value: 'مؤجر', labelAr: 'مؤجر', labelEn: 'Rented' },
];

export const LEGAL_OPTIONS = [
  { value: 'طابو أخضر/نظامي', labelAr: 'طابو أخضر / نظامي', labelEn: 'Green Deed' },
  { value: 'كاتب عدل/وكالة', labelAr: 'كاتب عدل / وكالة', labelEn: 'Notary' },
  { value: 'حكم محكمة', labelAr: 'حكم محكمة', labelEn: 'Court Ruling' },
];

// Section 4 — amenities (boolean inputs).
export const AMENITY_TOGGLES = [
  { name: 'near_hospital', labelAr: '🏥 قريب من مشفى', labelEn: '🏥 Near Hospital' },
  { name: 'near_market', labelAr: '🛒 قريب من سوق', labelEn: '🛒 Near Market' },
  { name: 'has_elevator', labelAr: '🛗 مصعد', labelEn: '🛗 Elevator' },
  { name: 'has_parking', labelAr: '🚗 موقف سيارات', labelEn: '🚗 Parking' },
  { name: 'is_furnished', labelAr: '🛋️ مفروش', labelEn: '🛋️ Furnished' },
];
