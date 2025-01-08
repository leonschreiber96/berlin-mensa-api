import getMenu, { Group } from "./menuParser.ts";
import CANTEENS from "./canteen.ts";
import JsonFilePersistence from "./persistence.ts";

async function* fetchAllMenusForDate(date: Date) {
   for (const canteen of CANTEENS) {
      const menu = await getMenu(canteen.id, date)
      yield { id: canteen.id, menu };
   }
}

function getRemainingWeekdaysOfWeek(): Date[] {
   const today = new Date();
   const remainingWeekdays: Date[] = [];

   // Start from today and loop until the end of the week (Saturday)
   for (let i = today.getDay(); i <= 5; i++) { // 0 = Sunday, 5 = Friday
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + (i - today.getDay()));
      remainingWeekdays.push(nextDay);
   }

   return remainingWeekdays;
}

function saveMenu(canteenId: number, menu: Group[], date: Date) {
   // Save the menu to a JSON file
   const persistence = new JsonFilePersistence<Group[]>(`./data/${canteenId}_${date.toISOString().split("T")[0]}.json`);
   persistence.save(menu);
}

function mergeMenus(oldMenu: Group[], newMenu: Group[]): Group[] {
   const mergedMenu: Group[] = [];
   for (const newGroup of newMenu) {
      const oldGroup = oldMenu.find(group => group.title === newGroup.title);
      if (oldGroup) {
         const replacedMeals = oldGroup.meals
            .filter(oldMeal => !newGroup.meals.some(newMeal => newMeal.name === oldMeal.name))
            .map(oldMeal => ({ ...oldMeal, historic: true }));
         newGroup.meals.push(...replacedMeals);
      }
      mergedMenu.push(newGroup); 
   }
   return mergedMenu;
}

export async function crawlMenusForWeek() {
   const remainingWeekdays = getRemainingWeekdaysOfWeek();
   for (const date of remainingWeekdays) {
      for await (const { id, menu } of fetchAllMenusForDate(date)) {
         const oldMenu = await new JsonFilePersistence<Group[]>(`./data/${id}_${date.toISOString().split("T")[0]}.json`).read();
         if (oldMenu) saveMenu(id, mergeMenus(oldMenu, menu), date);
         else saveMenu(id, menu, date);
      }
   }
}

export function clearMenus() {
   // Delete all files in the data directory
   const dataDir = "./data";
   for (const dirEntry of Deno.readDirSync(dataDir)) {
      Deno.removeSync(`${dataDir}/${dirEntry.name}`);
   }
}