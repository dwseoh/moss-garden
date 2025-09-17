interface MossGrowthProps {
  growthPercentage: number
}

export default function MossGrowth({ growthPercentage }: MossGrowthProps) {
  // Convert growth percentage to mm (assuming 100% = 2mm max display)
  const growthMm = (growthPercentage / 100) * 2

  // Calculate the visual height of the moss based on actual mm growth
  const mossHeight = Math.max(4, Math.floor(growthMm * 10)) // 10px per mm, min 4px

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-sm text-stone-300 mb-2 flex justify-between items-center">
        <span>Moss Growth</span>
        <span>{growthMm.toFixed(2)}mm</span>
      </div>

      {/* Planter container */}
      <div className="relative w-full h-24 bg-stone-800 rounded-lg overflow-hidden border border-stone-700">
        {/* Soil layer */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-stone-900 rounded-b-lg"></div>

        {/* Moss layer - grows with percentage */}
        <div
          className="absolute bottom-12 left-0 right-0 bg-gradient-to-t from-green-800 to-green-600 rounded-t-sm transition-all duration-1000 ease-in-out"
          style={{
            height: `${mossHeight}px`,
            boxShadow: growthPercentage > 50 ? "0 0 10px rgba(74, 222, 128, 0.3)" : "none",
          }}
        >
          {/* Moss texture - small bumps */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-2 bg-green-500 rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `scale(${0.5 + Math.random() * 0.8})`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Growth measurement markers */}
        <div className="absolute top-0 bottom-0 right-4 w-px bg-stone-700 flex flex-col justify-between py-2">
          <div className="relative">
            <div className="absolute right-0 w-2 h-px bg-stone-600"></div>
            <span className="absolute right-3 text-xs text-stone-500">2mm</span>
          </div>
          <div className="relative">
            <div className="absolute right-0 w-2 h-px bg-stone-600"></div>
            <span className="absolute right-3 text-xs text-stone-500">1mm</span>
          </div>
          <div className="relative">
            <div className="absolute right-0 w-2 h-px bg-stone-600"></div>
            <span className="absolute right-3 text-xs text-stone-500">0mm</span>
          </div>
        </div>

        {/* Planter rim */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-stone-700 rounded-t-lg"></div>
      </div>
    </div>
  )
}
