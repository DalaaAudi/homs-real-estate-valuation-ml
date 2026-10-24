import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

import heroImg from '../assets/hero.jpg';
import LanguageToggle from '../components/LanguageToggle';
import { AmenityToggle, GlassCard, NumberField, SelectField } from '../components/predictor/FormControls.jsx';
import {
  AMENITY_TOGGLES,
  AREA_FIELDS,
  BUILDING_FIELDS,
  CONDITION_OPTIONS,
  HEATING_OPTIONS,
  INITIAL_FORM,
  LEGAL_OPTIONS,
} from '../constants/predictorOptions';
import { getBackendErrorMessage, getLocations, predictPrice } from '../services/predictorApi';
import { validatePredictorForm } from '../utils/validatePredictorForm';

const formatNumber = (value) => Math.round(value).toLocaleString('en-US');

export default function PricePredictor() {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.resolvedLanguage || i18n.language || 'ar').startsWith('ar');
  const tr = (ar, en) => (isRtl ? ar : en);

  // The 16 inputs — never cleared after a submit, successful or not.
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(true);

  // Load the districts the model knows; failure means the service is unreachable.
  useEffect(() => {
    let cancelled = false;
    getLocations()
      .then((list) => {
        if (!cancelled) setLocations(list);
      })
      .catch((err) => {
        console.error('Could not fetch locations', err);
        if (!cancelled) setModelReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validatePredictorForm(formData, isRtl);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error(tr('يرجى تصحيح الحقول المظلّلة قبل احتساب القيمة', 'Please fix the highlighted fields before calculating the value'));
      return;
    }

    setLoading(true);
    try {
      setPrediction(await predictPrice(formData));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success(tr('تم التقييم بنجاح', 'Price Estimated Successfully'));
    } catch (err) {
      console.error('[predict]', err);
      toast.error(getBackendErrorMessage(err) || tr('حدث خطأ في الاتصال بالسيرفر', 'Server Connection Error'));
    } finally {
      setLoading(false);
    }
  };

  const toOptions = (options) =>
    options.map((o) => ({ value: o.value, label: isRtl ? o.labelAr : o.labelEn }));

  return (
    <div
      className={`relative min-h-screen font-['IBM_Plex_Sans_Arabic'] ${isRtl ? 'text-right' : 'text-left'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background layer */}
      <img src={heroImg} alt="" className="fixed inset-0 w-full h-full object-cover" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80"></div>

      <LanguageToggle />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-10 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/85 text-xs uppercase tracking-widest">
              <span>{t('predictor.badge_ai')}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a84c]/15 backdrop-blur-md border border-[#c9a84c]/40 text-[#c9a84c] text-xs font-medium tracking-wide">
              <span>{t('predictor.badge_scope')}</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-white uppercase tracking-widest mb-3">
            {t('predictor.page_title')}
          </h1>
          <p className="text-white/70 text-sm">{t('predictor.page_subtitle')}</p>
        </div>

        {!modelReady && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-400/40 bg-red-500/10 backdrop-blur-md px-5 py-4 text-sm text-white/90">
            <span>⚠️</span>
            <span>{tr('السيرفر غير متصل أو النموذج غير محمل', 'Server or Model not ready')}</span>
          </div>
        )}

        {/* Result card */}
        {prediction && (
          <div className="animate-bounce-in relative overflow-hidden rounded-2xl border border-[#c9a84c]/30 bg-white/10 backdrop-blur-md shadow-2xl p-9 md:p-11 mb-8 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]/90 mb-3">
              {tr('السعر التقديري بواسطة الذكاء الاصطناعي', 'Estimated Market Value')}
            </div>
            <div className="text-white font-light mb-1 text-5xl md:text-6xl" dir="ltr">
              <span className="text-2xl align-top text-[#c9a84c]/90 me-1">$</span>
              {formatNumber(prediction.priceUsd)}
            </div>
            <div className="text-white/60 text-sm mb-7">
              {formatNumber(prediction.pricePerSqmUsd)} {tr('$/م²', '$/m²')} · {prediction.location}
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              <span className="px-4 py-1.5 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 text-white/90 text-sm">
                📐 {prediction.totalAreaM2} {tr('م²', 'm²')}
              </span>
              <span className="px-4 py-1.5 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 text-white/90 text-sm">
                🛏 {formData.rooms_count} {tr('غرف', 'Rooms')}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: location & area */}
          <GlassCard icon="📍" title={tr('الموقع والمساحة', 'LOCATION & AREA')}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <SelectField
                className="sm:col-span-3"
                name="location"
                label={tr('المنطقة في حمص', 'Region in Homs')}
                value={formData.location}
                onChange={handleChange}
                options={locations.map((loc) => ({ value: loc, label: loc }))}
                placeholder={`— ${tr('اختر الحي', 'Select District')} —`}
                error={errors.location}
              />
              {AREA_FIELDS.map((f) => (
                <NumberField
                  key={f.name}
                  name={f.name}
                  label={tr(f.labelAr, f.labelEn)}
                  value={formData[f.name]}
                  onChange={handleChange}
                  min={f.min}
                  max={f.max}
                  required={f.required}
                  placeholder={tr(f.placeholderAr, f.placeholderEn)}
                  error={errors[f.name]}
                />
              ))}
            </div>
          </GlassCard>

          {/* Section 2: building details */}
          <GlassCard icon="🏗" title={tr('تفاصيل البناء', 'BUILDING DETAILS')}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {BUILDING_FIELDS.map((f) => (
                <NumberField
                  key={f.name}
                  name={f.name}
                  label={tr(f.labelAr, f.labelEn)}
                  value={formData[f.name]}
                  onChange={handleChange}
                  min={f.min}
                  max={f.max}
                  placeholder={tr(f.placeholderAr, f.placeholderEn)}
                  error={errors[f.name]}
                />
              ))}
            </div>
          </GlassCard>

          {/* Section 3: condition & legal status */}
          <GlassCard icon="📋" title={tr('الحالة والوضع القانوني', 'LEGAL & STATUS')}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <SelectField
                name="heating_type"
                label={tr('التدفئة', 'Heating')}
                value={formData.heating_type}
                onChange={handleChange}
                options={toOptions(HEATING_OPTIONS)}
                placeholder={`— ${tr('اختر', 'Select')} —`}
                error={errors.heating_type}
              />
              <SelectField
                name="house_condition"
                label={tr('حالة الشقة', 'Condition')}
                value={formData.house_condition}
                onChange={handleChange}
                options={toOptions(CONDITION_OPTIONS)}
                placeholder={`— ${tr('اختر', 'Select')} —`}
                error={errors.house_condition}
              />
              <SelectField
                name="legal_status"
                label={tr('الوضع القانوني', 'Legal')}
                value={formData.legal_status}
                onChange={handleChange}
                options={toOptions(LEGAL_OPTIONS)}
                placeholder={`— ${tr('اختر', 'Select')} —`}
                error={errors.legal_status}
              />
            </div>
          </GlassCard>

          {/* Section 4: amenities */}
          <GlassCard icon="✨" title={tr('المميزات', 'AMENITIES')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AMENITY_TOGGLES.map((item) => (
                <AmenityToggle
                  key={item.name}
                  name={item.name}
                  label={tr(item.labelAr, item.labelEn)}
                  checked={formData[item.name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </GlassCard>

          <button
            type="submit"
            disabled={loading || !modelReady}
            className="w-full py-5 bg-[#c9a84c] text-white text-sm font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#b39540] transition-all shadow-2xl shadow-[#c9a84c]/20 disabled:opacity-40"
          >
            {loading ? '...' : tr('🔮 احسب القيمة التقديرية', '🔮 CALCULATE VALUE')}
          </button>
        </form>
      </div>

      {/* Custom animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes bounce-in { 0% { transform: scale(0.9); opacity: 0; } 70% { transform: scale(1.03); } 100% { transform: scale(1); opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.8s ease-out; }
            .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
          `,
        }}
      />
    </div>
  );
}
