import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

import CANTEENS from "./canteen.ts";
import JsonFilePersistence from "./persistence.ts";
import { Group } from "./menuParser.ts";
import { crawlMenusForWeek, clearMenus } from "./crawler.ts";

const router = new Router();

router.get("/mensa", (ctx) => {
   ctx.response.body = `
   <html>
      <head>
         <title>Canteen Endpoints</title>
      </head>
      <body>
      <h1>Canteens</h1>
         ${CANTEENS.map(canteen => `<a href="/mensa/menu/${canteen.id}">(${canteen.id})</a> <span>${canteen.name}</span><br>`).join("")}
      </body>
   </html>
   `;
});

router.get("/mensa/menu/:canteenId", async (ctx) => {
   const canteenId = +ctx.params.canteenId;
   const date = ctx.request.url.searchParams.get("date") ? new Date(ctx.request.url.searchParams.get("date")!) : new Date();

   if (isNaN(canteenId) || !CANTEENS.map(canteen => canteen.id).includes(canteenId)) {
      ctx.response.status = 400;
      ctx.response.body = "Invalid canteenId";
      return;
   }

   if (isNaN(Date.parse(date.toString()))) {
      ctx.response.status = 400;
      ctx.response.body = "Invalid date";
      return;
   }

   const reader = new JsonFilePersistence<Group[]>(`./data/${canteenId}_${date.toISOString().split("T")[0]}.json`);
   const menu = await reader.read();
   const canteen = CANTEENS.find(canteen => canteen.id === canteenId);

   ctx.response.headers.set("Content-Type", "application/json");
   ctx.response.body = { date, canteen, menu };
});

const app = new Application();
const port = 8080;

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Server running on http://localhost:${port}`);

app.listen({ port: port });

// Fetch canteen info and menus in the morning, before opening hours and in the evening
Deno.cron("Fetch canteen info and menus", { hour: { exact: [8, 11, 18] } }, () => {
   console.log("Fetching canteen info and menus");
   clearMenus();
   crawlMenusForWeek();
});