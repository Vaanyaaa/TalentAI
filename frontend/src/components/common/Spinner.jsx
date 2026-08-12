const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-blue-200 border-t-blue-600 animate-spin`}
        style={{ borderWidth: size === 'lg' ? '4px' : size === 'md' ? '3px' : '2px' }}
      />
      {size === 'lg' && (
        <p className="text-sm text-slate-500 font-medium animate-pulse">Loading...</p>
      )}
    </div>
  );
};

export default Spinner;
