
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import PlanetSphere3D from "../components/PlanetSphere3D.jsx";
import VoiceNarration from "../components/VoiceNarration.jsx";
import CommentSection from "../components/CommentSection.jsx";
import Quiz from "../components/Quiz.jsx";

const PlanetDetail = () => {
  const { slug } = useParams(); 
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlanet = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/planets/${slug}`);
        setPlanet(res.data.data);
      } catch (err) {
        setError("Planet not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlanet();
  }, [slug]); 

  if (loading) return <p className="mx-auto max-w-4xl px-6 py-12 text-muted">Loading...</p>;
  if (error || !planet)
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-coral">{error}</p>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">
          Back to all planets
        </Link>
      </div>
    );

  
  const narrationText = `${planet.name}. ${planet.description} ${planet.funFact || ""}`;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/" className="mb-6 inline-block text-sm text-muted hover:text-accent">
        ← All planets
      </Link>

      <div className="mb-8 grid gap-8 sm:grid-cols-2 sm:items-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-wide text-accent">{planet.tagline}</span>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">{planet.name}</h1>
          <p className="mt-4 text-ink/80">{planet.description}</p>
          <div className="mt-5">
            <VoiceNarration text={narrationText} />
          </div>
        </div>

        
        <PlanetSphere3D color={planet.color} textureUrl={planet.textureUrl} />
      </div>

      
      {planet.facts?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-4">
          {planet.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-xs uppercase text-muted">{fact.label}</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-ink">{fact.value}</dd>
            </div>
          ))}
        </div>
      )}

      {planet.funFact && (
        <p className="mt-6 rounded-xl border border-line bg-panel p-4 text-sm text-ink/80">
          <span className="font-semibold text-accent">Did you know? </span>
          {planet.funFact}
        </p>
      )}

      <CommentSection planetId={planet._id} />
      <Quiz planetId={planet._id} />
    </div>
  );
};

export default PlanetDetail;