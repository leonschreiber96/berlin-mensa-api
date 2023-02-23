import { getDataForDate } from "../dataProvider.js";

export default async function today(req, res) {
   const data = await getDataForDate();
   res.send(data);
}