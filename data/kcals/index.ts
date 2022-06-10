// ES6 or TypeScript:
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import replaceall from "replaceall";
const html = fs.readFileSync(
  path.join(__dirname, "/Nutrition Information for Raw Vegetables _ FDA.html")
);
const $ = cheerio.load(html);

const tables = $("table");

const bodyRows = $(tables[0]).find("tbody tr");
console.log("Length: ", bodyRows.length);
for (let i = 0; i < bodyRows.length; i++) {
  const row = bodyRows[i];
  const cells = row.children; // $(row).find("td");
  const vals = [];
  for (let ii = 0; ii < cells.length; ii++) {
    let text = $(cells[ii]).text();
    text = replaceall("\n", "", text);
    text = replaceall("\t", "", text);
    vals.push(text);
  }
  // console.log(vals);
}
