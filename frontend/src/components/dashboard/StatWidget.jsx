import { TrendingUp } from 'lucide-react';

const StatWidget = ({ label, value, icon: Icon, color = 'blue', trend, description }) => {
  const colorMap = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-600',   text: 'text-blue-600' },
    green:  { bg: 'bg-emerald-50', icon: 'bg-emerald-600', text: 'text-emerald-600' },
    yellow: { bg: 'bg-amber-50',  icon: 'bg-amber-600',  text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-600', text: 'text-purple-600' },
    cyan:   { bg: 'bg-cyan-50',   icon: 'bg-cyan-600',   text: 'text-cyan-600' },
    red:    { bg: 'bg-red-50',    icon: 'bg-red-600',    text: 'text-red-600' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`${c.bg} rounded-2xl p-5 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200 group cursor-default`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`${c.icon} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            {trend}%
          </div>
        )}
      </div>
      <div className={`text-3xl font-bold ${c.text} mb-1`}>{value}</div>
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
    </div>
  );
};

export default StatWidget;
