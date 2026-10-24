// Glass-style building blocks for PricePredictor (same look as the approved page).

const baseControl =
  'w-full px-4 py-3 text-white border rounded-lg text-sm focus:outline-none focus:border-[#c9a84c]';
const borderFor = (error) => (error ? 'border-red-500' : 'border-white/25');

export function GlassCard({ icon, title, children }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-2xl p-7 md:p-9">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-white/10 grid place-items-center text-lg">{icon}</div>
        <h2 className="text-sm font-semibold text-white/85 uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FieldShell({ label, error, className = '', children }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs font-medium text-white/60">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 animate-bounce-in">{error}</p>}
    </div>
  );
}

export function NumberField({ name, label, value, onChange, min, max, placeholder, required = false, error }) {
  return (
    <FieldShell label={label} error={error}>
      <input
        type="number"
        name={name}
        required={required}
        min={min}
        max={max}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${baseControl} bg-white/5 placeholder:text-white/30 ${borderFor(error)}`}
      />
    </FieldShell>
  );
}

// `options` = [{ value, label }]
export function SelectField({ name, label, value, onChange, options, placeholder, error, className = '' }) {
  return (
    <FieldShell label={label} error={error} className={className}>
      <select
        name={name}
        required
        value={value}
        onChange={onChange}
        className={`${baseControl} bg-neutral-900/50 ${borderFor(error)}`}
      >
        <option value="" className="bg-neutral-900">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-neutral-900">
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function AmenityToggle({ name, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/20 bg-white/5 cursor-pointer hover:border-[#c9a84c]/60 transition-colors">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="accent-[#c9a84c] w-4 h-4" />
      <span className="text-sm text-white/85">{label}</span>
    </label>
  );
}
