import "dotenv/config";
import express from "express";
import connectDb from "./db/connectDb.js";
import productsRouter from "./router/productsRouter.js";
import { rateLimit } from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

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
