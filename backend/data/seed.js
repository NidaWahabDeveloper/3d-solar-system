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

    // const earth = inserted.find((p) => p.slug === "earth");
    // await QuizQuestion.insertMany([
    //   {
    //     planet: earth._id, difficulty: "easy",
    //     question: "What percentage of Earth's surface is covered by water?",
    //     options: ["71%", "50%", "90%", "30%"], correctAnswerIndex: 0,
    //   },
    //   {
    //     planet: earth._id, difficulty: "easy",
    //     question: "How many moons does Earth have?",
    //     options: ["0", "2", "1", "4"], correctAnswerIndex: 2,
    //   },
    //   {
    //     planet: earth._id, difficulty: "easy",
    //     question: "How long does Earth take to orbit the Sun?",
    //     options: ["24 hours", "365.25 days", "88 days", "12 years"], correctAnswerIndex: 1,
    //   },
    // ]);
    // console.log("Sample quiz questions seeded for Earth");


    const quizBank = [];
quizBank.push({ planet: inserted.find((p) => p.slug === "mercury")._id, difficulty: "easy", question: "What is Mercury's nickname in this app?", options: ["The Swift Messenger", "The Red Planet", "The Ringed Jewel", "The Windy Edge"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mercury")._id, difficulty: "easy", question: "How many moons does Mercury have?", options: ["0", "1", "2", "4"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mercury")._id, difficulty: "easy", question: "Is Mercury the closest planet to the Sun?", options: ["Yes", "No", "It's the farthest", "It's second closest"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mercury")._id, difficulty: "medium", question: "What is Mercury's diameter?", options: ["4,880 km", "12,742 km", "6,779 km", "49,244 km"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mercury")._id, difficulty: "medium", question: "How long is a day on Mercury (in Earth days)?", options: ["59 Earth days", "24 hours", "88 Earth days", "1 Earth day"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mercury")._id, difficulty: "medium", question: "How long is a year on Mercury?", options: ["88 Earth days", "365 Earth days", "59 Earth days", "12 Earth years"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mercury")._id, difficulty: "hard", question: "Which is true according to the fun fact about Mercury?", options: ["A year on Mercury is shorter than a day on Venus", "Mercury has the most moons", "Mercury is the largest planet", "Mercury has rings"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mercury")._id, difficulty: "hard", question: "Mercury has almost no what?", options: ["Atmosphere", "Gravity", "Rotation", "Core"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mercury")._id, difficulty: "hard", question: "Mercury swings between extreme what?", options: ["Heat and cold", "Light and dark only", "Wind speeds", "Water levels"], correctAnswerIndex: 0 });

quizBank.push({ planet: inserted.find((p) => p.slug === "venus")._id, difficulty: "easy", question: "What is Venus's nickname in this app?", options: ["Earth's Fiery Twin", "The Swift Messenger", "The Red Planet", "King of the Planets"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "venus")._id, difficulty: "easy", question: "How many moons does Venus have?", options: ["0", "1", "2", "3"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "venus")._id, difficulty: "easy", question: "Is Venus the hottest planet in the solar system?", options: ["Yes", "No", "Mercury is hotter", "Mars is hotter"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "venus")._id, difficulty: "medium", question: "What is Venus's diameter?", options: ["12,104 km", "4,880 km", "12,742 km", "6,779 km"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "venus")._id, difficulty: "medium", question: "How long is a day on Venus (in Earth days)?", options: ["243 Earth days", "88 Earth days", "24 hours", "365 Earth days"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "venus")._id, difficulty: "medium", question: "How long is a year on Venus?", options: ["225 Earth days", "88 Earth days", "365 Earth days", "687 Earth days"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "venus")._id, difficulty: "hard", question: "What makes Venus the hottest planet?", options: ["A thick, toxic atmosphere that traps heat", "Its closeness to the Sun", "Its size", "Its many moons"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "venus")._id, difficulty: "hard", question: "What unusual thing does Venus do compared to most planets?", options: ["It rotates backwards", "It has no atmosphere", "It orbits the Moon", "It has rings"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "venus")._id, difficulty: "hard", question: "Venus is often compared to which planet?", options: ["Earth", "Mars", "Mercury", "Jupiter"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "earth")._id, difficulty: "easy", question: "What percentage of Earth's surface is covered by water?", options: ["71%", "50%", "90%", "30%"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "earth")._id, difficulty: "easy", question: "How many moons does Earth have?", options: ["0", "2", "1", "4"], correctAnswerIndex: 2 });
quizBank.push({ planet: inserted.find((p) => p.slug === "earth")._id, difficulty: "easy", question: "How long does Earth take to orbit the Sun?", options: ["24 hours", "365.25 days", "88 days", "12 years"], correctAnswerIndex: 1 });
quizBank.push({ planet: inserted.find((p) => p.slug === "earth")._id, difficulty: "medium", question: "What is Earth's diameter?", options: ["12,742 km", "4,880 km", "12,104 km", "6,779 km"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "earth")._id, difficulty: "medium", question: "How long is a day on Earth?", options: ["24 hours", "243 Earth days", "59 Earth days", "16 hours"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "earth")._id, difficulty: "medium", question: "What is Earth's nickname in this app?", options: ["The Pale Blue Dot", "Earth's Fiery Twin", "The Red Planet", "The Tilted Giant"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "earth")._id, difficulty: "hard", question: "Earth is the only planet not named after what?", options: ["A Greek or Roman deity", "A star", "A moon", "An element"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "earth")._id, difficulty: "hard", question: "What protects Earth's surface, according to its description?", options: ["A magnetic field", "Thick clouds", "Strong winds", "Its rings"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "earth")._id, difficulty: "hard", question: "Earth is described as the only known planet to harbor what?", options: ["Life", "Rings", "Moons", "Volcanoes"], correctAnswerIndex: 0 });

quizBank.push({ planet: inserted.find((p) => p.slug === "mars")._id, difficulty: "easy", question: "What is Mars's nickname in this app?", options: ["The Red Planet", "The Pale Blue Dot", "The Windy Edge", "King of the Planets"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mars")._id, difficulty: "easy", question: "How many moons does Mars have?", options: ["0", "1", "2", "4"], correctAnswerIndex: 2 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mars")._id, difficulty: "easy", question: "What color is Mars known for?", options: ["Red", "Blue", "Green", "Yellow"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mars")._id, difficulty: "medium", question: "What is Mars's diameter?", options: ["6,779 km", "4,880 km", "12,742 km", "49,244 km"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mars")._id, difficulty: "medium", question: "How long is a year on Mars?", options: ["687 Earth days", "365 Earth days", "88 Earth days", "12 Earth years"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mars")._id, difficulty: "medium", question: "How long is a day on Mars?", options: ["24.6 hours", "24 hours", "59 Earth days", "16.1 hours"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mars")._id, difficulty: "hard", question: "Mars is home to Olympus Mons, which is the solar system's tallest what?", options: ["Volcano", "Mountain range", "Canyon", "Crater"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mars")._id, difficulty: "hard", question: "What does evidence suggest Mars once had?", options: ["Liquid water", "Rings", "A thick toxic atmosphere", "More moons than Jupiter"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "mars")._id, difficulty: "hard", question: "Mars has the largest what, alongside its tallest volcano?", options: ["Canyon", "Ocean", "Ice cap", "Desert"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "jupiter")._id, difficulty: "easy", question: "What is Jupiter's nickname in this app?", options: ["King of the Planets", "The Windy Edge", "The Tilted Giant", "The Ringed Jewel"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "jupiter")._id, difficulty: "easy", question: "Is Jupiter the largest planet in the solar system?", options: ["Yes", "No", "Saturn is larger", "Neptune is larger"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "jupiter")._id, difficulty: "easy", question: "What type of planet is Jupiter?", options: ["A gas giant", "A rocky planet", "An ice giant", "A dwarf planet"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "jupiter")._id, difficulty: "medium", question: "What is Jupiter's diameter?", options: ["139,820 km", "116,460 km", "50,724 km", "49,244 km"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "jupiter")._id, difficulty: "medium", question: "How long is a day on Jupiter?", options: ["9.9 hours", "24 hours", "10.7 hours", "17.2 hours"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "jupiter")._id, difficulty: "medium", question: "How long is a year on Jupiter?", options: ["12 Earth years", "29.5 Earth years", "84 Earth years", "165 Earth years"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "jupiter")._id, difficulty: "hard", question: "What is Jupiter's Great Red Spot?", options: ["A storm bigger than Earth", "A large moon", "A ring system", "A volcano"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "jupiter")._id, difficulty: "hard", question: "About how long has the Great Red Spot raged?", options: ["Over 350 years", "About 10 years", "50 years", "1000 years"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "jupiter")._id, difficulty: "hard", question: "Roughly how many moons does Jupiter have?", options: ["95+", "27", "14", "2"], correctAnswerIndex: 0 });

quizBank.push({ planet: inserted.find((p) => p.slug === "saturn")._id, difficulty: "easy", question: "What is Saturn's nickname in this app?", options: ["The Ringed Jewel", "King of the Planets", "The Tilted Giant", "The Windy Edge"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "saturn")._id, difficulty: "easy", question: "What is Saturn famous for?", options: ["Its ring system", "Its red color", "Its high winds", "Its many volcanoes"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "saturn")._id, difficulty: "easy", question: "What are Saturn's rings mostly made of?", options: ["Ice and rock", "Gas", "Metal", "Water"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "saturn")._id, difficulty: "medium", question: "What is Saturn's diameter?", options: ["116,460 km", "139,820 km", "50,724 km", "49,244 km"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "saturn")._id, difficulty: "medium", question: "How long is a day on Saturn?", options: ["10.7 hours", "9.9 hours", "17.2 hours", "16.1 hours"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "saturn")._id, difficulty: "medium", question: "How long is a year on Saturn?", options: ["29.5 Earth years", "12 Earth years", "84 Earth years", "165 Earth years"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "saturn")._id, difficulty: "hard", question: "What is unusual about Saturn's density?", options: ["It is the least dense planet and could float in water", "It is the densest planet", "It has no measurable density", "It is denser than Earth"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "saturn")._id, difficulty: "hard", question: "Roughly how many moons does Saturn have?", options: ["140+", "95+", "27", "14"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "saturn")._id, difficulty: "hard", question: "Saturn's ring system is made of ice and what else?", options: ["Rock", "Gas", "Dust only", "Metal"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "uranus")._id, difficulty: "easy", question: "What is Uranus's nickname in this app?", options: ["The Tilted Giant", "The Ringed Jewel", "King of the Planets", "The Windy Edge"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "uranus")._id, difficulty: "easy", question: "What makes Uranus unusual compared to other planets?", options: ["It rotates on its side", "It has no moons", "It is the hottest planet", "It has no atmosphere"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "uranus")._id, difficulty: "easy", question: "When was Uranus discovered using a telescope?", options: ["1781", "1610", "1846", "1930"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "uranus")._id, difficulty: "medium", question: "What is Uranus's diameter?", options: ["50,724 km", "49,244 km", "116,460 km", "139,820 km"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "uranus")._id, difficulty: "medium", question: "How long is a day on Uranus?", options: ["17.2 hours", "16.1 hours", "10.7 hours", "9.9 hours"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "uranus")._id, difficulty: "medium", question: "How long is a year on Uranus?", options: ["84 Earth years", "165 Earth years", "29.5 Earth years", "12 Earth years"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "uranus")._id, difficulty: "hard", question: "What likely caused Uranus's extreme tilt?", options: ["An ancient collision", "The Sun's gravity", "Its many moons", "Its ring system"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "uranus")._id, difficulty: "hard", question: "How many moons does Uranus have?", options: ["27", "14", "95+", "140+"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "uranus")._id, difficulty: "hard", question: "What kind of extreme seasons does Uranus's tilt cause?", options: ["Seasons that last decades", "No seasons at all", "Seasons that change hourly", "Seasons only at the poles"], correctAnswerIndex: 0 });

quizBank.push({ planet: inserted.find((p) => p.slug === "neptune")._id, difficulty: "easy", question: "What is Neptune's nickname in this app?", options: ["The Windy Edge", "The Tilted Giant", "The Ringed Jewel", "King of the Planets"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "neptune")._id, difficulty: "easy", question: "Is Neptune the farthest planet from the Sun?", options: ["Yes", "No", "Uranus is farther", "Pluto is farther"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "neptune")._id, difficulty: "easy", question: "What is Neptune known for having the strongest of?", options: ["Winds", "Rings", "Volcanoes", "Moons"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "neptune")._id, difficulty: "medium", question: "What is Neptune's diameter?", options: ["49,244 km", "50,724 km", "116,460 km", "139,820 km"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "neptune")._id, difficulty: "medium", question: "How long is a day on Neptune?", options: ["16.1 hours", "17.2 hours", "10.7 hours", "9.9 hours"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "neptune")._id, difficulty: "medium", question: "How long is a year on Neptune?", options: ["165 Earth years", "84 Earth years", "29.5 Earth years", "12 Earth years"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "neptune")._id, difficulty: "hard", question: "How fast can Neptune's winds reach?", options: ["2,100 km/h", "500 km/h", "1,000 km/h", "300 km/h"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "neptune")._id, difficulty: "hard", question: "How was Neptune first found?", options: ["Predicted mathematically before it was seen", "Spotted by the naked eye", "Discovered by a telescope by accident", "Found using radar"], correctAnswerIndex: 0 });
quizBank.push({ planet: inserted.find((p) => p.slug === "neptune")._id, difficulty: "hard", question: "How many moons does Neptune have?", options: ["14", "27", "95+", "140+"], correctAnswerIndex: 0 });

await QuizQuestion.insertMany(quizBank);
console.log(`${quizBank.length} quiz questions seeded across all planets`);

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();