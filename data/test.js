const _ = require('underscore');
const fs = require('fs');
const path = require('path');

let filePath = path.join(__dirname, '/crops/crops.json');
const crops = JSON.parse(fs.readFileSync(filePath));

filePath = path.join(__dirname, '/city/export.json');
const cities = JSON.parse(fs.readFileSync(filePath));
const city = cities[Math.floor(Math.random() * cities.length)];
console.log("CITY: ", city.city + ', ' + city.country);
let monthMap = null;
if (city.exactMatch) {
    console.log("EXACT MATCH: " + city.exactMatch.city + ', ' + city.exactMatch.country);
    monthMap = city.exactMatch.monthMap;
} else {
    console.log("Nearest MATCH: " + city.nearestMatch.city + ', ' + city.nearestMatch.country + ' - dist: ' + city.nearestMatchDist);
    monthMap = city.nearestMatch.exactMatch.monthMap;
}


crops.forEach((crop) => {
    let tempMatchMonthCount = 0;
    const minDurationMonths = crop.harvestDayMin / 30;
    let startMonth = 1;
    let endMonthStart = -1;
    let endMonthEnd = -1;
    let finalStartMonth = -1;
    let realMonth;
    for(let i = 1; i < 25; i++) {
        realMonth = i;
        if (realMonth > 12) {
            realMonth = realMonth - 12;
        }
        const avgTemp = monthMap[i];
        if(
            crop.lowTemp > avgTemp ||
            crop.highTemp < avgTemp
        ) {
            // Fail
            tempMatchMonthCount = 0;
            startMonth = realMonth;
        } else {
            tempMatchMonthCount += 1;
            if (tempMatchMonthCount > minDurationMonths) {
                if (finalStartMonth === -1) {
                    finalStartMonth = startMonth;
                }
                if (endMonthStart === -1) {
                    endMonthStart = realMonth;
                }
                endMonthEnd = realMonth;
            }
        }



    }
    if (endMonthStart !== -1) {
        console.log(crop.name + ' Start: ' + finalStartMonth + ' End: ' + endMonthStart + ' - ' + endMonthEnd);
    }
});
