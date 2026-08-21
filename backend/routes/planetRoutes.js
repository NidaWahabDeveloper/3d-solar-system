import express from "express";
import { body } from "express-validator";
import {
  getPlanets,
  getPlanetBySlug,
  createPlanet,
  updatePlanet,
  deletePlanet,
} from "../controllers/planetController.js";
import { getCommentsForPlanet, addComment } from "../controllers/commentController.js";
import { protect, authorize } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { cacheRoute } from "../middleware/cacheMiddleware.js";

const router = express.Router();


const planetValidationRules = [
  body("name").trim().notEmpty().withMessage("Planet name is required"),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must be lowercase letters, numbers, and hyphens only"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("orbitPosition").isInt({ min: 1, max: 8 }).withMessage("Orbit position must be 1-8"),
];


router.get("/", cacheRoute("planets"), getPlanets);
router.get("/:slug", getPlanetBySlug); 


router.post("/", protect, authorize("admin"), planetValidationRules, validateRequest, createPlanet);
router.put("/:id", protect, authorize("admin"), planetValidationRules, validateRequest, updatePlanet);
router.delete("/:id", protect, authorize("admin"), deletePlanet);


router.get("/:planetId/comments", getCommentsForPlanet); 
router.post(
  "/:planetId/comments",
  protect, 
  [body("text").trim().notEmpty().withMessage("Comment text is required").isLength({ max: 500 })],
  validateRequest,
  addComment
);

export default router;