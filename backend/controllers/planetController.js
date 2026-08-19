import asyncHandler from "express-async-handler";
import Planet from "../models/Planet.js";
import { clearCacheByPrefix } from "../middleware/cacheMiddleware.js";


export const getPlanets = asyncHandler(async (req, res) => {
  
  const planets = await Planet.find().sort("orbitPosition");
  res.status(200).json({ success: true, count: planets.length, data: planets });
});


export const getPlanetBySlug = asyncHandler(async (req, res) => {
  const planet = await Planet.findOne({ slug: req.params.slug });

  if (!planet) {
    res.status(404);
    throw new Error("Planet not found");
  }

  res.status(200).json({ success: true, data: planet });
});


export const createPlanet = asyncHandler(async (req, res) => {
  
  const planet = await Planet.create({ ...req.body, createdBy: req.user._id });

  
  clearCacheByPrefix("planets:");

  res.status(201).json({ success: true, data: planet });
});


export const updatePlanet = asyncHandler(async (req, res) => {
  const planet = await Planet.findById(req.params.id);

  if (!planet) {
    res.status(404);
    throw new Error("Planet not found");
  }


  Object.assign(planet, req.body);
  await planet.save();

  clearCacheByPrefix("planets:"); 

  res.status(200).json({ success: true, data: planet });
});


export const deletePlanet = asyncHandler(async (req, res) => {
  const planet = await Planet.findById(req.params.id);

  if (!planet) {
    res.status(404);
    throw new Error("Planet not found");
  }

  await planet.deleteOne();
  clearCacheByPrefix("planets:"); 

  res.status(200).json({ success: true, data: {} }); 
});