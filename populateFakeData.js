import "dotenv/config";
import connectDb from "./db/connectDb.js";
import { faker } from "@faker-js/faker";
import productsModel from "./model/productsModel.js";

export function createRandomUser() {
  return {
    productName: faker.internet.userName(),
    company: ["A", "B", "C"][Math.floor(Math.random() * 4)],
    rating: faker.number.int({ max: 10, min: 0 }),
    feature: faker.lorem.sentence(),
  };
}

const start = async () => {
  try {
    // Connect with database
    await connectDb();
    // Generate fake data with faker ( count:50 )
    let data = faker.helpers.multiple(createRandomUser, {
      count: 50,
    });
    // Delete all previous data
    await productsModel.deleteMany();
    // Insert new fresh data
    await productsModel.insertMany(data);
  } catch (error) {
    console.log(error);
  }
};

start();
