import { Element } from "https://esm.sh/v135/domhandler@5.0.3/lib/node.d.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0"

interface Allergen {
   id: string;
   name: string;
}

interface Meal {
   name: string;
   prices: number[];
   co2Value: string | null;
   co2Info: string | null;
   waterValue: string | null;
   waterInfo: string | null;
   mealAllergens: Allergen[];
   ampelValue: number;
   dietValue: string | null;
}

export interface Group {
   title: string;
   meals: Meal[];
}

async function fetchCanteenHtml(id: number, date?: Date): Promise<string> {
   if (date === undefined) date = new Date();
   
   const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", 'User-Agent': 'Mozilla/5.0' },
      body: new URLSearchParams({
         resources_id: id.toString(),
         date: date.toISOString().split("T")[0],
      }),
   };
   const response = await fetch("https://www.stw.berlin/xhr/speiseplan-wochentag.html", options);

   return response.text();
}

const allergenRegex = /\(([\d\w]+)\)\s+(.*)/

function parseMenu (html: string) {
   const $ = cheerio.load(html);

   const allergenTexts = $('input[type="checkbox"].itemkennz').map((_, el) => $(el).closest('label').text().trim()).get();
   
   // Define allergens as an array of objects
   const allergens: Allergen[] = allergenTexts
      .map((text: string) => {
         const match = text.match(allergenRegex);
         if (match) {
            return { id: match[1], name: match[2] };
         }
         return null;
      })
      .filter(Boolean) as Allergen[];

   // Change groups array to hold objects instead of strings
   const groups: Group[] = [];
   $('.splGroupWrapper').each((_, el) => {
      const title = $(el).find('.splGroup').text().trim();
      const meals = $(el).find('.splMeal').map((_, mealEl) => parseMeal($(mealEl), allergens)).get();
      groups.push({ title, meals });
   });

   return groups;
};

function parseMeal(el: cheerio.Cheerio<Element>, allergens: Allergen[]): Meal {
   const mealAllergens = (el.attr('data-kennz')?.split(",").map((kennz) => allergens.find((a) => a.id === kennz)).filter(Boolean) || []) as Allergen[]; 
   const name = el.find('.bold').text().trim();
   
   const prices = el.find('.text-right').last().text()
      .replace("€", "").replaceAll(",", ".").trim().split("/")
      .map((p) => parseFloat(p));
   
   const ampelValue = ["grün", "gelb", "rot"].indexOf(el.find('strong:contains("Ampelpunkt")').text().match(/(.+?)er Ampelpunkt:/)?.[1]?.toLowerCase() || "");

   const co2Value = el.find(".col-xs-3").text().match(/(\d+ g) CO2 \/ Portion/)?.[1] || null;
   const waterValue = el.find(".col-xs-3").text().match(/(\d+\.\d+)\s*l\s*Wasserverbrauch \/ Portion/)?.[1] || null;

   const co2Info = el.find('img[alt*="CO₂"]').attr('alt') || null;
   const waterInfo = el.find("img[alt*='Wasser']").attr('alt') || null;

   const dietValue = el.find(".col-xs-3 strong").text().match(/(Vegan|Vegetarisch)/)?.[0] || null;

   return {
      name,
      prices,
      co2Value,
      co2Info,
      waterValue,
      waterInfo,
      mealAllergens,
      ampelValue,
      dietValue
   };
}

export default async function getMenu(canteenId: number, date?: Date): Promise<Group[]> {
   const html = await fetchCanteenHtml(canteenId, date);
   return parseMenu(html);
}