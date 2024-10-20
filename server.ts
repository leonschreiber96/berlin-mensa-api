import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

import CANTEENS from "./canteen.ts";
import JsonFilePersistence from "./persistence.ts";
import { Group } from "./menuParser.ts";
import { crawlMenusForWeek, clearMenus } from "./crawler.ts";
import requestLogger, { flushLogsToDisk } from "./requestLogger.ts";

const apiRouter = new Router({ prefix: "/api" });
const staticRouter = new Router();

apiRouter.use(requestLogger)
staticRouter.use(requestLogger)

staticRouter.get("/", async (ctx) => {
   // Serve index.html
   await ctx.send({
      root: `${Deno.cwd()}/static`,
      index: "index.html",
   });
});

apiRouter.get("/", (ctx) => {
   ctx.response.headers.set("Content-Type", "application/json");
   ctx.response.body = CANTEENS;
});

apiRouter.get("/menu/:canteenId", async (ctx) => {

   const canteenId = +ctx.params.canteenId;
   if (isNaN(canteenId) || !CANTEENS.map(canteen => canteen.id).includes(canteenId)) {
      ctx.response.status = 400;
      ctx.response.body = "Invalid canteenId";
      return;
   }

   const dateParam = ctx.request.url.searchParams.get("date") || new Date().toISOString().split("T")[0];
   if (isNaN(Date.parse(dateParam.toString()))) {
      ctx.response.status = 400;
      ctx.response.body = "Invalid date";
      return;
   }
   const date = new Date(dateParam);

   const reader = new JsonFilePersistence<Group[]>(`./data/${canteenId}_${date.toISOString().split("T")[0]}.json`);
   const menu = await reader.read();

   const canteen = CANTEENS.find(canteen => canteen.id === canteenId);

   ctx.response.headers.set("Content-Type", "application/json");
   ctx.response.body = { date, canteen, menu };
});

const app = new Application();
const port = 8080;

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());
app.use(staticRouter.routes());
app.use(staticRouter.allowedMethods());

app.listen({ port: port });

console.log(`Server running on http://localhost:${port}`);

// Fetch canteen info and menus in the morning, before opening hours and in the evening
Deno.cron("Fetch canteen info and menus", { hour: { exact: [8, 11, 18] } }, () => {
   console.log(new Date().toISOString(), "Fetching canteen info and menus");
   clearMenus();
   crawlMenusForWeek();
});

// Flush logs to disk every 5 minutes
Deno.cron("Flush logs to disk", { minute: { every: 1 } }, () => {
   console.log(new Date().toISOString(), "Flushing logs to disk");
   flushLogsToDisk();
});