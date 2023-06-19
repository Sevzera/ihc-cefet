import express from "express";
import cors from "cors";
import routes from "./routes.js";

const port = 1999;
const api = express();


api.use(cors({ origin: "*" }));
api.use(express.json({ limit: '25mb' }));
api.use(express.urlencoded({ limit: '25mb', extended: true }));
api.use(routes);

api.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
