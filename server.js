import "dotenv/config";
import express from "express";
import connectDb from "./db/connectDb.js";
import productsRouter from "./router/productsRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/products", productsRouter);

const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
