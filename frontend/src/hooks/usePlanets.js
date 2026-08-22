import { useEffect, useState } from "react";

// TODO: point BASE_URL to your backend server (see backend/server.js)
const BASE_URL = "http://localhost:5000/api";

export const usePlanets = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const res = await fetch(`${BASE_URL}/planets`);
        const data = await res.json();
        setPlanets(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanets();
  }, []);

  return { planets, loading, error };
};

export const usePlanetDetail = (id) => {
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchPlanet = async () => {
      try {
        const res = await fetch(`${BASE_URL}/planets/${id}`);
        const data = await res.json();
        setPlanet(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanet();
  }, [id]);

  return { planet, loading, error };
};
