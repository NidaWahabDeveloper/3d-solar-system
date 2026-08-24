// Animated solar system bnana hai jisme Sun in the center, planets on rings, hr ek apni spees pe orbit p hoga.
// Only SVG + CSS animation, no external GIF/video .

const PLANETS = [
  { name: "Mercury", radius: 40, size: 4, color: "#9B9B9B", duration: "4s" },
  { name: "Venus", radius: 60, size: 6, color: "#E8C07D", duration: "7s" },
  { name: "Earth", radius: 82, size: 6.5, color: "#4C7BE1", duration: "10s" },
  { name: "Mars", radius: 102, size: 5, color: "#C1440E", duration: "15s" },
  { name: "Jupiter", radius: 128, size: 11, color: "#D8A25E", duration: "22s" },
  { name: "Saturn", radius: 155, size: 10, color: "#E3C77F", duration: "30s" },
];

const SolarSystemOrbit = () => {
  return (
    <div className="relative mx-auto h-[340px] w-[340px] sm:h-[400px] sm:w-[400px]">
      {/* halke grey circles hain jo planet ke ghumne ka raasta (path) dikhate hain */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="-170 -170 340 340"
      >
        {PLANETS.map((p) => (
          <circle
            key={`ring-${p.name}`}
            cx="0"
            cy="0"
            r={p.radius}
            fill="none"
            stroke="#E5E3DD"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* The Sun center me hoga, glowing */}
      <div
        className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, #FFD98A 0%, #E8A33D 70%)",
          boxShadow: "0 0 24px 6px rgba(232,163,61,0.55)",
        }}
      />

      {/* Har planet ke liye do layers hain: bahar wali div (outer div) ghoomti hai (yehi orbit ka motion hai), aur andar wali div (jisme asal planet ka dot hai) ulta ghoomti hai (counter-spin) taake planet khud apni jagah pe seedha rahe, sirf uska center orbit pe ghoome."*/}
      {PLANETS.map((p) => (
        <div
          key={p.name}
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{
            animation: `spin ${p.duration} linear infinite`,
          }}
        >
          <div
  className="group absolute rounded-full cursor-pointer"
  style={{
    width: p.size,
    height: p.size,
    backgroundColor: p.color,
    left: p.radius,
    top: -p.size / 2,
    boxShadow: `0 0 4px 1px ${p.color}66`,
  }}
>
  <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
    {p.name}
  </span>
</div>
        </div>
      ))}

      {/* Keyframes for the orbit spin -- scoped inline so this component has zero extra CSS files */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SolarSystemOrbit;