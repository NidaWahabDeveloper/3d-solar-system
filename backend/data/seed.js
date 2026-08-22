import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Planet from "../models/Planet.js";
import QuizQuestion from "../models/QuizQuestion.js";

dotenv.config();
// Seed data for planets and quiz questions
const planetsData = [
  {
    name: "Mercury", slug: "mercury", tagline: "The Swift Messenger",
    description: "The smallest and innermost planet, Mercury has almost no atmosphere and swings between extreme heat and cold.",
    color: "#9B9B9B", orbitPosition: 1,
    textureUrl: "/textures/mercury.jpg",
    facts: [
      { label: "Diameter", value: "4,880 km" },
      { label: "Day length", value: "59 Earth days" },
      { label: "Year length", value: "88 Earth days" },
      { label: "Moons", value: "0" },
    ],
    funFact: "A year on Mercury is shorter than a day on Venus.",
  },
  {
    name: "Venus", slug: "venus", tagline: "Earth's Fiery Twin",
    description: "Venus is wrapped in a thick, toxic atmosphere that traps heat, making it the hottest planet in the solar system.",
    color: "#E8C07D", orbitPosition: 2,
    textureUrl: "/textures/venus.jpg",
    facts: [
      { label: "Diameter", value: "12,104 km" },
      { label: "Day length", value: "243 Earth days" },
      { label: "Year length", value: "225 Earth days" },
      { label: "Moons", value: "0" },
    ],
    funFact: "Venus rotates backwards compared to most planets.",
  },
  {
    name: "Earth", slug: "earth", tagline: "The Pale Blue Dot",
    description: "The only known planet to harbor life, Earth's surface is 71% water and protected by a magnetic field.",
    color: "#4C7BE1", orbitPosition: 3,
    textureUrl: "/textures/earth.jpg",
    facts: [
      { label: "Diameter", value: "12,742 km" },
      { label: "Day length", value: "24 hours" },
      { label: "Year length", value: "365.25 days" },
      { label: "Moons", value: "1" },
    ],
    funFact: "Earth is the only planet not named after a Greek or Roman deity.",
  },
  {
    name: "Mars", slug: "mars", tagline: "The Red Planet",
    description: "Mars has the largest volcano and canyon in the solar system, and evidence suggests it once had liquid water.",
    color: "#C1440E", orbitPosition: 4,
    textureUrl: "/textures/mars.jpg",
    facts: [
      { label: "Diameter", value: "6,779 km" },
      { label: "Day length", value: "24.6 hours" },
      { label: "Year length", value: "687 Earth days" },
      { label: "Moons", value: "2" },
    ],
    funFact: "Mars is home to Olympus Mons, the tallest volcano in the solar system.",
  },
  {
    name: "Jupiter", slug: "jupiter", tagline: "King of the Planets",
    description: "The largest planet in the solar system, Jupiter is a gas giant with a Great Red Spot storm bigger than Earth.",
    color: "#D8A25E", orbitPosition: 5,
    textureUrl: "/textures/jupiter.jpg",
    facts: [
      { label: "Diameter", value: "139,820 km" },
      { label: "Day length", value: "9.9 hours" },
      { label: "Year length", value: "12 Earth years" },
      { label: "Moons", value: "95+" },
    ],
    funFact: "Jupiter's Great Red Spot storm has raged for over 350 years.",
  },
  {
    name: "Saturn", slug: "saturn", tagline: "The Ringed Jewel",
    description: "Famous for its spectacular ring system made of ice and rock, Saturn is the least dense planet in the solar system.",
    color: "#E3C77F", orbitPosition: 6,
    textureUrl: "/textures/saturn.jpg",
    facts: [
      { label: "Diameter", value: "116,460 km" },
      { label: "Day length", value: "10.7 hours" },
      { label: "Year length", value: "29.5 Earth years" },
      { label: "Moons", value: "140+" },
    ],
    funFact: "Saturn is so light it could theoretically float in water.",
  },
  {
    name: "Uranus", slug: "uranus", tagline: "The Tilted Giant",
    description: "Uranus rotates on its side, likely due to an ancient collision, giving it extreme seasons that last decades.",
    color: "#9FE3E3", orbitPosition: 7,
    textureUrl: "/textures/uranus.jpg",
    facts: [
      { label: "Diameter", value: "50,724 km" },
      { label: "Day length", value: "17.2 hours" },
      { label: "Year length", value: "84 Earth years" },
      { label: "Moons", value: "27" },
    ],
    funFact: "Uranus was the first planet discovered using a telescope, in 1781.",
  },
  {
    name: "Neptune", slug: "neptune", tagline: "The Windy Edge",
    description: "The farthest planet from the sun, Neptune has the strongest winds in the solar system, reaching 2,100 km/h.",
    color: "#3E54E8", orbitPosition: 8,
    textureUrl: "/textures/neptune.jpg",
    facts: [
      { label: "Diameter", value: "49,244 km" },
      { label: "Day length", value: "16.1 hours" },
      { label: "Year length", value: "165 Earth years" },
      { label: "Moons", value: "14" },
    ],
    funFact: "Neptune was predicted mathematically before it was ever seen.",
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await Planet.deleteMany();
    await QuizQuestion.deleteMany();

    let admin = await User.findOne({ email: "admin@solarsystem.com" });
    if (!admin) {
      admin = await User.create({
        name: "Admin",
        email: "admin@solarsystem.com",
        password: "admin123",
        role: "admin",
      });
      console.log("Default admin created: admin@solarsystem.com / admin123");
    }

    const inserted = await Planet.insertMany(
      planetsData.map((p) => ({ ...p, createdBy: admin._id }))
    );
    console.log(`${inserted.length} planets seeded`);

    const earth = inserted.find((p) => p.slug === "earth");
    await QuizQuestion.insertMany([
      {
        planet: earth._id, difficulty: "easy",
        question: "What percentage of Earth's surface is covered by water?",
        options: ["71%", "50%", "90%", "30%"], correctAnswerIndex: 0,
      },
      {
        planet: earth._id, difficulty: "easy",
        question: "How many moons does Earth have?",
        options: ["0", "2", "1", "4"], correctAnswerIndex: 2,
      },
      {
        planet: earth._id, difficulty: "easy",
        question: "How long does Earth take to orbit the Sun?",
        options: ["24 hours", "365.25 days", "88 days", "12 years"], correctAnswerIndex: 1,
      },
    ]);
    console.log("Sample quiz questions seeded for Earth");

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();