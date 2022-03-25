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
                locData.geoMatch = result;
                result._found = true;
                report.matches.push(locData);
               /* locMap[result.Country] = locMap[result.Country] || {};
                locMap[result.Country][result.City] = result;
                const cityData = {};
                crops.push(cityData);*/
                /*const cityData = {};
                crops.push(cityData);*/
            });
            results.forEach((result) => {
                if (result._found) {
                    return;
                }
                let minDist = -1;
                let bestMatch = null;
                report.matches.forEach((locData) => {
                    let dist = geolib.getDistance(
                        {
                            latitude: locData.geoMatch.lat,
                            longitude: locData.geoMatch.lng
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

            console.log("result.closeMatchCount50: ", report.closeMatchCount50);
            console.log("result.closeMatchCount500: ", report.closeMatchCount500);
        });
});