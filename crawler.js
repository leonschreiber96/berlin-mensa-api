import jsdom from "jsdom";
import fs from "fs";

const CANTEENS = [
   {id: 147, name: "Mensa HU Nord", command: "hu_nord"},
   {id: 191, name: "Mensa HU Oase Adlershof", command: "hu_adlershof"},
   {id: 270, name: "Backshop HU Spandauer Straße", command: "hu_spandauer"},
   {id: 271, name: "Mensa FU Herrenhaus Düppel", command: "fu_dueppel"},
   {id: 277, name: "Backshop FU Rechtswissenschaften", command: "fu_rechtswissenschaft"},
   {id: 319, name: "Mensa HTW Wilhelminenhof", command: "htw_wilhelminenhof"},
   {id: 320, name: "Mensa HTW Treskowallee", command: "htw_treskowallee"},
   {id: 321, name: "Mensa TU Hardenbergstraße", command: "tu_mensa"},
   {id: 322, name: "Mensa FU II", command: "fu_2"},
   {id: 323, name: "Mensa FU I", command: "fu_1"},
   {id: 367, name: "Mensa HU Süd", command: "hu_sued"},
   {id: 368, name: "Backshop FU OSI", command: "fu_osi"},
   {id: 526, name: "Mensa HWR Badensche Straße", command: "hwr_badenschestr"},
   {id: 527, name: "Mensa Berliner Hochschule für Technik Luxemburger Straße", command: "bht_luxembugerstr"},
   {id: 528, name: "Mensa FU Lankwitz Malteserstraße", command: "fu_lankwitz"},
   {id: 529, name: "Mensa EHB Teltower Damm", command: "ehb_teltower_damm"},
   {id: 530, name: "Mensa KHS Weißensee", command: "khs_weissensee"},
   {id: 5302,name: "Backshop TU Hardenbergstraße", command: "tu_mensa_backshop"},
   {id: 531, name: "Mensa HfM Charlottenstraße", command: "hfm_charlottenstr"},
   {id: 532, name: "Backshop KHSB", command: "khs_backshop"},
   {id: 533, name: "Mensa HfS Ernst Busch", command: "hfs_ernstbusch"},
   {id: 534, name: "Mensa ASH Berlin Hellersdorf", command: "ash_hellersdorf"},
   {id: 537, name: "Mensa Charité Zahnklinik", command: "charite_zahnklinik"},
   {id: 538, name: "Mensa TU Marchstraße", command: "tu_marchstr"},
   {id: 540, name: "Mensa Pastaria TU Architektur", command: "tu_architektur"},
   {id: 541, name: "Backshop TU Wetterleuchten", command: "tu_wetterleuchten"},
   {id: 542, name: "Mensa FU Pharmazie", command: "fu_pharmazie"},
   {id: 5477,name: "Backshop BHT Luxemburger Straße", command: "bht_luxemburgerstr_backshop"},
   {id: 5501,name: "Backshop HfM Charlottenstraße", command: "hfm_charlottenstr_backshop"},
   {id: 631, name: "Mensa Pasteria TU Veggie 2.0 – Die vegane Mensa", command: "tu_veggie"},
   {id: 657, name: "Mensa TU „Skyline“", command: "tu_skyline"},
   {id: 660, name: "Mensa FU Koserstraße", command: "fu_koserstr"},
   {id: 661, name: "Backshop HU „c.t.“", command: "hu_ct"},
   {id: 723, name: "Backshop HfM Neuer Marstall", command: "hfm_neuer_marstall"},
   {id: 727, name: "Backshop HWR Alt-Friedrichsfelde", command: "hwr_alt_friedrichsfelde"},
]

async function getCanteenHtml(id, date) {
   if (!date) date = new Date();
   else date = new Date(date);
   const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
         resources_id: id,
         date: date.toISOString().split("T")[0],
      }),
   };
   const response = await fetch("https://www.stw.berlin/xhr/speiseplan-wochentag.html", options);

   return response.text();
}

function parseCanteenHtml(html) {
   const doc = new jsdom.JSDOM(html).window.document;

   const canteenData = [];
   const menuGroups = doc.querySelectorAll("div.splGroupWrapper");

   for (const group of menuGroups) {
      const groupTitleHtml = group.querySelector("div.splGroup");
      var groupTitle = "";
      if (groupTitleHtml) groupTitle = groupTitleHtml.innerHTML;

      const meals = [];
      const menuItems = group.querySelectorAll("div.splMeal");

      for (const menuItem of menuItems) {
         const meal = {
            annotation: undefined,
            title: menuItem.querySelector("span.bold").textContent,
            price: {},
         };
         const prices = menuItem.querySelector("div.text-right").textContent.replaceAll("\n", "").replaceAll("€", "").replaceAll(",", ".").trim().split("/");
         meal.price.student = +prices[0];
         meal.price.employee = +prices[1];
         meal.price.other = +prices[2];
         const icons = menuItem.querySelectorAll("img.splIcon");
         for (const icon of icons) {
            if (icon.src.includes("icons/15.png")) meal.annotation = "vegan";
            else if (icon.src.includes("icons/1.png")) meal.annotation = "vegetarian";
            else if (icon.src.includes("icons/38.png")) meal.annotation = "fish";
         }
         if (!meal.annotation) meal.annotation = "meat";
         meals.push(meal);
      }

      canteenData.push({ name: groupTitle, meals });
   }

   return canteenData;
}

async function loadData(id, date) {
   const html = await getCanteenHtml(id, date);
   const meals = await parseCanteenHtml(html);

   return meals;
}

function listDownloadedData() {
   const files = fs.readdirSync("./data");
   const archives = [];

   for (const file of files) {
      const parts = file.split("-");
      archives.push({ id: parts[0], day: parts[1], month: parts[2], year: parts[3]});
   }

   return archives;
}

function deleteOldArchives(archives) {
   const oldArchives = archives.filter((archive) => {
      const date = new Date(archive.year, archive.month, archive.day-1);
      const today = new Date();
      return date < today;
   });

   for (const archive of oldArchives) {
      fs.unlinkSync(`./data/${archive.id}-${archive.day}-${archive.month}-${archive.year}`);
   }
}

export async function crawl(canteenIds) {
   if (!canteenIds) canteenIds = CANTEENS.map(x => x.id)

   const archives = listDownloadedData();
   deleteOldArchives(archives);

   for (const id of canteenIds) {
      for (let i = 0; i < 7; i++) {
         const date = new Date(new Date() + i * 24 * 60 * 60 * 1000);
         const meals = await loadData(id, date);
         const filename = `${id}-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

         fs.writeFile(`./data/${filename}.json`, JSON.stringify(meals), (err) => {
            if (err) console.error(err);
         });
      }
   }
}