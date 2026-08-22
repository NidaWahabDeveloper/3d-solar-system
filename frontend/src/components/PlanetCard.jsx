import { Link } from "react-router-dom";

const PlanetCard = ({ planet }) => {
  return (
    <Link
      to={`/planets/${planet.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* A flat-color circle standing in for the planet's thumbnail -- fast to render in a grid of many cards */}
      <div className="flex h-40 items-center justify-center bg-surface">
        <div
          className="h-20 w-20 rounded-full shadow-inner transition-transform group-hover:scale-110"
          style={{ backgroundColor: planet.color }}
          aria-hidden="true" 
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <span className="font-mono text-xs uppercase tracking-wide text-muted">
          {String(planet.orbitPosition).padStart(2, "0")} · from the sun
        </span>
        <h3 className="font-display text-xl font-semibold text-ink">{planet.name}</h3>
        <p className="text-sm text-muted">{planet.tagline}</p>
      </div>
    </Link>
  );
};

export default PlanetCard;
