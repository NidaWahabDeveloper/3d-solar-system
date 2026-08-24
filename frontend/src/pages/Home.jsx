
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import PlanetCard from "../components/PlanetCard.jsx";
import SunSphere from "../components/SunSphere.jsx";
import SolarSystemOrbit from "../components/SolarSystemOrbit.jsx";

const Home = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
       
        const res = await api.get("/planets");
        setPlanets(res.data.data);
      } catch (err) {
        setError("Could not load planets. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchPlanets();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
    
      <section className="mb-16 flex flex-col items-center gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          An interactive field guide
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Explore the solar system, one orbit at a time.
        </h1>
        <p className="max-w-xl text-muted">
          Spin real-time 3D models, listen to narrated facts, discuss with other explorers,
          and test what you've learned with a timed quiz -- for every planet in our system.
        </p>

        {/* start sun component */}

        <section className="mb-16 flex flex-col-reverse items-center gap-8 sm:flex-row sm:justify-between">

  <SunSphere />
</section>

{/* close sun component */}

      </section>

      
      {loading && <p className="text-muted">Loading planets...</p>}
      {error && <p className="text-coral">{error}</p>}

      {!loading && !error && planets.length === 0 && (
        <p className="text-muted">
          No planets yet -- an admin needs to add some from the admin panel, or run the seed script.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {planets.map((planet) => (
          <PlanetCard key={planet._id} planet={planet} />
        ))}
      </div>
      <SolarSystemOrbit />
    </div>
  );
};

export default Home;