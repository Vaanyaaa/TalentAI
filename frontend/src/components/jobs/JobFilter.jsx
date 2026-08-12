import { SlidersHorizontal, X } from 'lucide-react';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];
const EXPERIENCE_LEVELS = [
  { label: 'Fresher (0 yrs)', value: '0' },
  { label: '0-1 Years', value: '0-1' },
  { label: '1-2 Years', value: '1-2' },
  { label: '2-3 Years', value: '2-3' },
  { label: '3-5 Years', value: '3-5' },
  { label: '5+ Years', value: '5+' },
];

const JobFilter = ({ filters, onChange, onClear }) => {
  const hasFilters = filters.employmentType || filters.experienceRequired || filters.location;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-slate-800 text-sm">Filters</h3>
        </div>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
          >
            <X className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Location */}
      <div className="mb-5">
        <label className="form-label">Location</label>
        <input
          type="text"
          placeholder="e.g. Bangalore, Delhi..."
          className="form-input text-sm"
          value={filters.location || ''}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
        />
      </div>

      {/* Job Type */}
      <div className="mb-5">
        <label className="form-label">Job Type</label>
        <div className="space-y-2 mt-1">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="employmentType"
                value={type}
                checked={filters.employmentType === type}
                onChange={() =>
                  onChange({
                    ...filters,
                    employmentType: filters.employmentType === type ? '' : type,
                  })
                }
                className="w-4 h-4 text-blue-600 accent-blue-600"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-2">
        <label className="form-label">Experience Required</label>
        <div className="space-y-2 mt-1">
          {EXPERIENCE_LEVELS.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="experienceRequired"
                value={value}
                checked={filters.experienceRequired === value}
                onChange={() =>
                  onChange({
                    ...filters,
                    experienceRequired: filters.experienceRequired === value ? '' : value,
                  })
                }
                className="w-4 h-4 text-blue-600 accent-blue-600"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobFilter;
