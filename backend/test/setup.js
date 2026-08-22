import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer;

// runs once before all tests — spins up a temporary in-memory MongoDB
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // real MongoDB, but RAM-only and temporary
  const uri = mongoServer.getUri();
  await mongoose.connect(uri); // connect mongoose to this temp DB
});

// runs after every single test — clears all data so tests don't leak into each other
afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// runs once after all tests are done — cleans everything up so Jest can exit properly
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});