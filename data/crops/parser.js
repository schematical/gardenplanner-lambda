const csv = require('csv-parser');
const convert = require('convert-units');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const replaceall = require("replaceall");
const results = [];
const filePath = path.join(__dirname, '/crops.csv');
console.log("filePath", filePath);
const crops = [];
const F = '°F';
const C = '°C';
function has(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
}
function removePlural(str) {
    str = str.toLowerCase();
    switch(str){
        case('potatoes'):
            return 'potato';
        case('sweet potatoes'):
            return 'sweet potato';
        case('tomatoes'):
            return 'tomato';
    }
    if (str.substr(str.length - 1, 1) === 's'){
        return str.substr(0, str.length - 1);
    }
    return str;
}
const cropMap = {};
fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {

        results.forEach((result, index) => {
            const cropData = {};
            cropData.index = index;
            cropData.name = result.Name;

            cropData.sewInGarden = result.sowInstructions.indexOf('Sow in garden.') !== -1;
            cropData.growDifficulty = (result.sowInstructions.indexOf('Easy to grow.') !== -1) ? 'easy' : 'medium';
            let parts = result.sowInstructions.split('Best planted at soil temperatures between');
            parts = parts[1].split('.');
            parts = parts[0].split('and');



            let unitOfMeasurment = null;
            if (
                has(parts[0], F) &&
                has(parts[1], F)
            ) {
                unitOfMeasurment = F;
            } else if (
                has(parts[0], C) &&
                has(parts[1], C)
            ){
                unitOfMeasurment = C;
            } else {
                throw new Error("No valid unitOfMeasurment found: " + result.sowInstructions);
            }

            cropData.lowTemp = parseInt(parts[0].trim().replace(unitOfMeasurment, ''));
            cropData.highTemp = parseInt(parts[1].trim().replace(unitOfMeasurment, ''));
            if (unitOfMeasurment === F) {
                cropData.lowTemp =  convert(cropData.lowTemp).from('F').to("C");
                cropData.highTemp =  convert(cropData.highTemp).from('F').to("C");
            }

            let spaceInstructions = result.spaceInstructions.replace('Space plants:', '');
            let seperator = null;
            if (has(spaceInstructions, '-')) {
                seperator = '-';
            }
            if (has(spaceInstructions, ' to ')) {
                seperator = ' to ';
            }
            let low = -1;
            let high = -1;

            let unit = null;
            if (seperator) {
                parts = spaceInstructions.trim().split(' ');
                low = parts[0];
                high = parts[2];
                unit = parts[3];
            } else {
                parts = spaceInstructions.trim().split(' ');
                low = parts[0];
                high = parts[0];
                unit = parts[1];
            }
            if (
                _.isNaN(low) ||
                _.isNaN(high)
            ){
                throw new Error("Parsing range failed: '" + spaceInstructions + "'" + JSON.stringify(parts, null, 3) + '\n' + low + '/' + high);
            }
            switch(unit){
                case('inches'):
                    unit = 'in';
            }
            try {
                cropData.minSpacing = convert(parseInt(low)).from(unit).to('cm');
                cropData.maxSpacing = convert(parseInt(high)).from(unit).to('cm');
            }catch(e) {
                console.error("spaceInstructions: ", spaceInstructions);
                throw e;
            }

            const harvestInstructions = result.harvestInstructions.replace('Harvest in ', '').trim()
            parts = harvestInstructions.split(' ');
            if (parts[0] === 'approximately') {
                parts.shift(1);
            }
            low = null;
            high = null;
            unit = null;
            if(has(parts[0], '-')){
                let parts2 = parts[0].split('-');
                low = parts2[0];
                high = parts2[1];
                unit = parts[1];
            } else {
                low = parts[0];
                high = parts[0];
                unit = parts[1];
            }
            if (!unit) {
                throw new Error("No Unit: Parsing range failed: '" + harvestInstructions + "'" + JSON.stringify(parts, null, 3) + '\n' + low + '/' + high)
            }
            if (
                _.isNaN(low) ||
                _.isNaN(high)
            ){
                throw new Error("Parsing range failed: '" + harvestInstructions + "'" + JSON.stringify(parts, null, 3) + '\n' + low + '/' + high);
            }
            unit = unit.replace('.', '');
            let multiplier = 1;
            switch(unit.toLowerCase()){

                case('week'):
                case('weeks'):
                    multiplier = 7;
                    break;
                case('month'):
                case('months'):
                    multiplier = 30;
                    break;

                case('year'):
                case('years'):
                    multiplier = 365;
            }
            cropData.harvestDayMin = parseInt(low) * multiplier;
            cropData.harvestDayMax = parseInt(high) * multiplier;
            if(_.isNaN(cropData.harvestDayMax)) {
                throw new Error("harvestDayMax is NaN: " + multiplier + ' x ' + high + ' harvestInstructions: ' + harvestInstructions + ' unit: ' + unit);
            }

            parts = result.compatiblePlants.split(':');
            if(parts.length !== 2) {
                // throw new Error("Error Parsing `compatiblePlants`: " + result.compatiblePlants + JSON.stringify(result, null, 3));
            } else {
                let compatableStr = parts[1].trim();
                compatableStr = replaceall('(', '', compatableStr);
                compatableStr = replaceall(')', '', compatableStr);
                const compatable = compatableStr.split(',');
                cropData.compatableRaw = [];
                compatable.forEach((entry) => {
                    if (has(entry.toLowerCase(), ' and ')) {
                        const parts2 = entry.split(' and ');
                        parts2.forEach((part) => {
                            cropData.compatableRaw.push(part.toLowerCase().trim());
                        })
                    } else {
                        cropData.compatableRaw.push(entry.toLowerCase().trim());
                    }
                })
            }


            parts = result.avoidInstructions.split(':');
            if(parts.length !== 2) {
                // throw new Error("Error Parsing `avoidInstructions`: " + result.compatiblePlants + JSON.stringify(result, null, 3));
            } else {
                let avoidStr = parts[1].trim();
                avoidStr = replaceall('(', '', avoidStr);
                avoidStr = replaceall(')', '', avoidStr);
                const avoid = avoidStr.split(',');
                cropData.avoidRaw = [];
                avoid.forEach((entry) => {
                    if (has(entry.toLowerCase(), ' and ')) {
                        const parts2 = entry.split(' and ');
                        parts2.forEach((part) => {
                            cropData.avoidRaw.push(part.toLowerCase().trim());
                        })
                    } else {
                        cropData.avoidRaw.push(entry.toLowerCase().trim());
                    }
                })
            }



            // avoidInstructions
            crops.push(cropData);
            cropMap[cropData.name.toLowerCase()] = cropData;
        });
        crops.forEach((cropData) => {
            if (cropData.compatableRaw) {

                cropData.compatable = [];
                cropData._missedCompatables = [];
                cropData.compatableRaw.forEach((name) => {
                    let foundCompatable = false;
                    crops.forEach((testCropData) => {
                        if (testCropData.name.toLowerCase().indexOf(removePlural(name.toLowerCase())) !== -1) {
                            cropData.compatable.push(testCropData.index);
                            foundCompatable = true;
                        }
                    });
                    if (!foundCompatable) {
                        cropData._missedCompatables.push(name);
                    }
                });
            }


            if (cropData.avoidRaw) {

                cropData.avoid = [];
                cropData._missedAvoids = [];
                cropData.avoidRaw.forEach((name) => {
                    let found = false;
                    crops.forEach((testCropData) => {
                        if (testCropData.name.toLowerCase().indexOf(removePlural(name.toLowerCase())) !== -1) {
                            cropData.avoid.push(testCropData.index);
                            found = true;
                        }
                    });
                    if (!found) {
                        cropData._missedAvoids.push(name);
                    }
                });
            }
        })
        console.log(crops);
    });