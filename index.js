import express from "express";

import today from "./routes/today.js";
import { crawl } from "./crawler.js";

const app = express();
const port = 5005;

app.get("/", today);

crawl();

app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
});