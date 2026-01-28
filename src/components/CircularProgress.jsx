const CircularProgress = ({ size = 48, strokeWidth = 5, progress = 0 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="text-slate-700"
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-indigo-500 transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-bold text-slate-100">
        {Math.round(progress)}%
      </span>
    </div>
  );
};

export default CircularProgress;
