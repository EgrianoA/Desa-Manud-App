import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import router from "./routers";
import morgan from "morgan";
import cors from "cors";

//For env File
dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3001;

mongoose
  .connect(
    process.env.MONGO_URI as string,
    {
      dbName: process.env.MONGO_DB_NAME as string,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
  .then(() => console.info("MongoDB Connected"))
  .catch((err) => console.info(err));

app.use(cors());
app.use(morgan(':date[iso] ":method :url"'));
app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
  console.info(`Server is running at ${port}`);
});
