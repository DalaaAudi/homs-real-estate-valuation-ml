import { NUMERIC_FIELDS, SELECT_FIELDS } from '../constants/predictorOptions';

// Returns { fieldName: message } for every invalid field (empty = valid).
export function validatePredictorForm(formData, isRtl) {
  const tr = (ar, en) => (isRtl ? ar : en);
  const errors = {};

  if (!formData.location) {
    errors.location = tr('يرجى اختيار المنطقة', 'Please select a district');
  }

  NUMERIC_FIELDS.forEach(({ name, min, max }) => {
    const raw = formData[name];
    if (raw === '' || raw === null || raw === undefined) {
      errors[name] = tr('هذا الحقل مطلوب', 'This field is required');
      return;
    }
    const num = Number(raw);
    if (Number.isNaN(num)) {
      errors[name] = tr('قيمة غير صالحة', 'Invalid value');
      return;
    }
    if (num < min || num > max) {
      errors[name] = tr(`القيمة يجب أن تكون بين ${min} و ${max}`, `Value must be between ${min} and ${max}`);
    }
  });

  const totalArea = Number(formData.total_area);
  const netArea = Number(formData.net_area);
  if (!errors.net_area && netArea && totalArea && netArea > totalArea * 1.05) {
    errors.net_area = tr(
      'المساحة الصافية لا يمكن أن تكون أكبر من المساحة الإجمالية',
      'Net area cannot exceed total area'
    );
  }

  SELECT_FIELDS.forEach((name) => {
    if (!formData[name]) {
      errors[name] = tr('يُرجى اختيار عنصر من القائمة', 'Please select an option from the list');
    }
  });

  return errors;
}
