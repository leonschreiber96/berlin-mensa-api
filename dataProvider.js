export async function getDataForDate(date) {
   return new Promise((resolve, reject) => {
      resolve(
         [
            {
               "name": "Vorspeisen", "meals": [{ "annotation": "vegan", "title": "Glasnudelsalat mit frischer Minze ", "price": { "student": 1.95, "employee": 2.15, "other": 2.35 } }]
            },
            {
               "name": "Salate", "meals": [{ "annotation": "vegan", "title": "Große Salatschale ", "price": { "student": 1.95, "employee": 3.9, "other": 4.3 } }, { "annotation": "vegan", "title": "Kleine Salatschale ", "price": { "student": 0.75, "employee": 1.5, "other": 1.65 } }, { "annotation": "vegan", "title": "Sauce Vinaigrette ", "price": { "student": 0, "employee": null, "other": null } }, { "annotation": "vegan", "title": "French-Dressing ", "price": { "student": 0, "employee": null, "other": null } }, { "annotation": "vegan", "title": "American-Dressing ", "price": { "student": 0, "employee": null, "other": null } }]
            },
            {
               "name": "Suppen", "meals": [{ "annotation": "vegetarian", "title": "Maiscremesuppe ", "price": { "student": 0.6, "employee": 1.2, "other": 1.3 } }]
            },
            {
               "name": "Aktionen", "meals": [{ "annotation": "vegan", "title": "Hausgemachte Pasta an Tomaten-Tofu-Sauce", "price": { "student": 2.45, "employee": 2.7, "other": 2.95 } }, { "annotation": "meat", "title": "Hartkäse gerieben ", "price": { "student": 0.75, "employee": 0.85, "other": 0.9 } }, { "annotation": "meat", "title": "Gelbes Rindfleischcurry mit Gemüse und Basmatireis ", "price": { "student": 6.95, "employee": 7.65, "other": 8.35 } }, { "annotation": "vegetarian", "title": "Flammkuchen mit frischen Zwiebeln und Schluppen ", "price": { "student": 4.95, "employee": 5.45, "other": 5.95 } }, { "annotation": "vegetarian", "title": "Pizza Margherita ", "price": { "student": 4.95, "employee": 5.45, "other": 5.95 } }, { "annotation": "meat", "title": "Flammkuchen mit Speck ", "price": { "student": 4.95, "employee": 5.45, "other": 5.95 } }]
            },
            {
               "name": "Essen", "meals": [{ "annotation": "meat", "title": "Gebratene Hähnchenkeule an Rosmarinsauce", "price": { "student": 3.45, "employee": 6.9, "other": 7.6 } }, { "annotation": "vegan", "title": "Zwei gebackene Falafel-Bagel an Chili-Ingwer-Sauce", "price": { "student": 1.95, "employee": 3.9, "other": 4.3 } }, { "annotation": "vegan", "title": "Kichererbsenragout mit Kartoffeln oder Reis, Kreuzkümmel und Koriander ", "price": { "student": 1.9, "employee": 3.8, "other": 4.2 } }, { "annotation": "vegan", "title": "Thailändische Kartoffelsuppe mit Kokosmilch und Ingwer ", "price": { "student": 1.45, "employee": 2.9, "other": 3.2 } }, { "annotation": "vegetarian", "title": "Germknödel mit Pflaumenmusfüllung, Mohnzucker Vanillesauce", "price": { "student": 1.45, "employee": 2.9, "other": 3.2 } }]
            },
            {
               "name": "Beilagen", "meals": [{ "annotation": "vegan", "title": "Ratatouille ", "price": { "student": 0.85, "employee": 1.7, "other": 1.85 } }, { "annotation": "vegan", "title": "Gartengemüse ", "price": { "student": 0.6, "employee": 1.2, "other": 1.3 } }, { "annotation": "vegan", "title": "Backkartoffeln ", "price": { "student": 0.85, "employee": 1.7, "other": 1.85 } }, { "annotation": "vegan", "title": "Petersilienkartoffeln ", "price": { "student": 0.7, "employee": 1.4, "other": 1.55 } }, { "annotation": "vegan", "title": "Parboiledreis ", "price": { "student": 0.6, "employee": 1.2, "other": 1.3 } }, { "annotation": "meat", "title": "Sauce & Dip Extra ", "price": { "student": 0.3, "employee": 0.6, "other": 0.65 } }]
            },
            {
               "name": "Desserts", "meals": [{ "annotation": "vegan", "title": "Marinierter Obstsalat ", "price": { "student": 1.5, "employee": 1.65, "other": 1.8 } }, { "annotation": "vegetarian", "title": "Vanillegrießbrei ", "price": { "student": 0.7, "employee": 1.4, "other": 1.55 } }, { "annotation": "vegetarian", "title": "Joghurt mit Honig und Sesam ", "price": { "student": 0.7, "employee": 1.4, "other": 1.55 } }, { "annotation": "vegetarian", "title": "Mandarinenquark ", "price": { "student": 0.7, "employee": 1.4, "other": 1.55 } }, { "annotation": "vegan", "title": "Schokoladenpudding ", "price": { "student": 0.7, "employee": 1.4, "other": 1.55 } }, { "annotation": "vegan", "title": "Beerengrütze ", "price": { "student": 0.7, "employee": 1.4, "other": 1.55 } }, { "annotation": "vegan", "title": "Vanillesauce ", "price": { "student": 0.7, "employee": 1.4, "other": 1.55 } }]
            }]
      );
   });
}