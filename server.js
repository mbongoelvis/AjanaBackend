import express from "express"
// this helps to log in the terminal when a user access and endpoint
import morgan from "morgan";
// this helps to secure the headers
import helmet from "helmet";
import cors from "cors";
// this is for env variables
import dotenv from "dotenv";
import { connectDB } from "./utils/dbConnection.js";
import userRouter from "./routes/user.js";
import subscriberRouter from "./routes/subscriber.js";
import blogRouter from "./routes/blog.js";

// invocking dotenv
dotenv.config();

// cors setup

// initalizing the app to express
const app = express();

// call database function
connectDB();

// setting the PORT
const port = process.env.PORT || 3500;

// setting up  the middelwares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// backend routes
app.use("/api/auth", userRouter);
app.use("/api/subscriber", subscriberRouter);
app.use("/api/blog", blogRouter);

// creating the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
