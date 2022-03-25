const csv = require('csv-parser');
const convert = require('convert-units');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const replaceall = require("replaceall");
const geolib = require('geolib');
let results = [];

const F = '°F';
const C = '°C';
function has(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
}
const cities = [];
const locMap = {};
const report = {
    missingCountries: [],
    missingCity: [],
    matches: [],
    closeMatchCount50: 0,
    closeMatchCount500: 0

}
return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '/temp.csv');
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {

            results.forEach((result, index) => {
                locMap[result.Country.toLowerCase()] = locMap[result.Country.toLowerCase()] || {};
                locMap[result.Country.toLowerCase()][result.City.toLowerCase()] = result;
                result.monthMap = {};
                let month = 1;
                Object.keys(result).forEach((key, index) => {

                    switch(key) {
                        case('Jan'):
                        case('Feb'):
                        case('Mar'):
                        case('Apr'):
                        case('May'):
                        case('Jun'):
                        case('Jul'):
                        case('Aug'):
                        case('Sep'):
                        case('Oct'):
                        case('Nov'):
                        case('Dec'):
                            let parts = result[key].split("\n");
                            result[key] = parts[0];
                            result[key] = replaceall('(', '', result[key]);
                            result[key] = replaceall(')', '', result[key]);
                            result[key] = parseFloat(result[key]);
                            result.monthMap[month] = result[key];
                            month += 1;
                            break;
                    }
                })
            });
            return resolve();
        });
})
.then(() => {
    results = [];
    const filePath = path.join(__dirname, '/worldcities.csv');
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {

            results.forEach((result, index) => {

                if (!locMap[result.country.toLowerCase()]) {
                    if (!_.contains(report.missingCountries, result.country.toLowerCase())) {
                        report.missingCountries.push(result.country.toLowerCase());
                    }
                    return;
                }
                if (!locMap[result.country.toLowerCase()][result.city.toLowerCase()]) {
                    let key = (result.city + ', ' +result.country).toLowerCase();
                    report.missingCity.push(key);
                    return;
                }

                const locData = locMap[result.country.toLowerCase()][result.city.toLowerCase()];
                // locData.geoMatch = result;
                result.exactMatch = locData;
                report.matches.push(result);

            });
            results.forEach((result) => {
                if (result.exactMatch) {
                    return;
                }
                let minDist = -1;
                let bestMatch = null;
                report.matches.forEach((locData) => {
                    let dist = geolib.getDistance(
                        {
                            latitude: locData.lat,
                            longitude: locData.lng
                        },
                        {
                            latitude: result.lat,
                            longitude:  result.lng
                        }
                    );
                    if (
                        !bestMatch ||
                        dist < minDist
                    ) {
                        bestMatch = locData;
                        minDist = dist;
                    }
                });
                result.nearestMatchDist = minDist / 1000;
                result.nearestMatch = bestMatch;
                if (result.nearestMatchDist < 50) {
                    report.closeMatchCount50 += 1;
                } else if (result.nearestMatchDist < 500) {
                    report.closeMatchCount500 += 1;
                }
                console.log(
                    result.city + ', ' + result.country + ' -> ' +
                    result.nearestMatch.City + ', ' + result.nearestMatch.Country +
                    ' - dist: ' + result.nearestMatchDist
                );

            });


            const filePath = path.join(__dirname, '/export.json');
            fs.writeFileSync(
                filePath,
                JSON.stringify(results, null, 3)
            );
            console.log("result.closeMatchCount50: ", report.closeMatchCount50);
            console.log("result.closeMatchCount500: ", report.closeMatchCount500);

            console.log("DONE");
        });
});