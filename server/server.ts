import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import router from "./routers";

//For env File
dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.get("/api", router);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
