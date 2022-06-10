import "reflect-metadata";
import { Container, Inject, Service } from "typedi";
import { CropSpecies, CropSpeciesSewMethods } from "./CropSpecies.entity";
import * as fs from "fs";
import { BaseService } from "../../../libs/Base.service";
import pluralize from "pluralize";
import _ from "lodash";
import DataLoader from "dataloader";
@Service("CropSpeciesService")
export class CropSpeciesService extends BaseService(CropSpecies) {
  @Inject("CropSpeciesModel")
  private cropSpeciesModel;

  constructor() {
    super();
  }

  async importTest() {
    await this.cropSpeciesModel.remove({});
    const cropDatas = JSON.parse(
      fs
        .readFileSync(
          "/home/user1a/WebstormProjects/gardenplanner-lambda/data/crops/crops.json"
        )
        .toString()
    );
    let cropSpeciesColl: CropSpecies[] = [];
    cropDatas.forEach((cropData) => {
      const cropSpecies = new CropSpecies();
      cropSpecies.name = cropData.name;
      cropSpecies.importId = "v0.1:" + cropData.index;
      cropSpecies.lowTemp = Math.round(cropData.lowTemp);
      cropSpecies.highTemp = Math.round(cropData.highTemp);
      cropSpecies.harvestDayMax = cropData.harvestDayMax;
      cropSpecies.harvestDayMin = cropData.harvestDayMin;
      cropSpecies.maxSpacingInCM = Math.round(cropData.maxSpacing);
      cropSpecies.minSpacingInCM = Math.round(cropData.minSpacing);
      cropSpecies.otherNames = cropData.otherNames;
      cropSpecies.sewingMethods = [];
      if (cropData.sewInGarden) {
        cropSpecies.sewingMethods.push(CropSpeciesSewMethods.IN_GARDEN);
      }
      cropSpeciesColl.push(cropSpecies);
    });
    cropSpeciesColl = await this.cropSpeciesModel.create(cropSpeciesColl);
    for (const cropSpecies of cropSpeciesColl) {
      const cropData = cropDatas.find(
        (c) => "v0.1:" + c.index === cropSpecies.importId
      );
      if (!cropData) {
        throw new Error(
          "Could not find a cropData with importId matching: " +
            cropSpecies.importId
        );
      }
      const realCompatable = [];
      if (cropData.compatable) {
        cropData.compatable.forEach((compatableIndex) => {
          const foundCropSpecies = cropSpeciesColl.find(
            (c) => "v0.1:" + compatableIndex === c.importId
          );
          if (!foundCropSpecies) {
            throw new Error(
              "Could not find a cropSpecies with importId matching: " +
                compatableIndex
            );
          }
          realCompatable.push(foundCropSpecies._id);
        });
        cropSpecies.compatibleCropSpecieIds = realCompatable;
      }

      if (cropData.avoid) {
        const realAvoid = [];
        cropData.avoid.forEach((avoidIndex) => {
          const foundCropSpecies = cropSpeciesColl.find(
            (c) => "v0.1:" + avoidIndex === c.importId
          );
          if (!foundCropSpecies) {
            throw new Error(
              "Could not find a cropSpecies with importId matching: " +
                avoidIndex
            );
          }
          realAvoid.push(foundCropSpecies._id);
        });
        cropSpecies.avoidCropSpecieIds = realAvoid;
      }
    }
    await this.cropSpeciesModel.bulkSave(cropSpeciesColl);
    return cropSpeciesColl;
  }

  async importCal() {
    const nMap = {
      1004: 'fat',
      1008: 'kcal',
      1003: 'protein',
      1005: 'carbs',
      2000: 'sugar'
    }
    const foodDatas: any = await this.parseCSV(
      "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/food.csv"
    );
    const nutrientDatas: any = await this.parseCSV(
        "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/nutrient.csv"
    );
    const nutrientMap: any = {};
    nutrientDatas.forEach((nutrientData) => {
      nutrientMap[nutrientData.id] = nutrientData;
    })
    const measureUnitDatas: any = await this.parseCSV(
        "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/measure_unit.csv"
    );
    const measureUnitMap: any = {};
    measureUnitDatas.forEach((d) => {
      measureUnitMap[d.id] = d;
    })
    const foodPortionDatas: any = await this.parseCSV(
        "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/food_portion.csv"
    );
    const foodNutrientDatas: any = await this.parseCSV(
        "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/food_nutrient.csv"
    );
    const foodNutrientDataMap = {};
    foodNutrientDatas.forEach((d) => {
      if (parseInt(d.nutrient_id) == 1008) {
        foodNutrientDataMap[d.fdc_id] = true;
      }
    })
    const brandedDatas: any = await this.parseCSV(
        "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/branded_food.csv"
    );
    let foundCount = 0;
    const cropSpeciesColl = await this.cropSpeciesModel.find({fdcId: null}).limit(1);
    console.log("cropSpeciesColl: ", cropSpeciesColl);
    for (let cropSpecies of cropSpeciesColl) {
      console.log("Searching: ", cropSpecies._id, cropSpecies.names);
      cropSpecies.fdcIds = [];
      cropSpecies.fdcId = null;
      let foundFoodData = [];
      const searchColl = [cropSpecies.name.trim().toLowerCase()];
      if (cropSpecies.otherNames) {
        cropSpecies.otherNames.forEach((otherName) => {
          searchColl.push(otherName.trim().toLowerCase());
        });
      }
      console.log(searchColl);
      foodDatas.forEach((foodData) => {
        foodData = _.clone(foodData);
        searchColl.forEach((search) => {
          let scoreMultiplier = 1;
          let match = false;
          if (
            // foodData.data_type === "foundation_food" &&
            foodData.description.toLowerCase().indexOf(search) !== -1
          ) {
            match = true;
          } else {
            const parts = search.split(' ');
            parts.forEach((pSearch) => {
              pSearch = pSearch.trim();
              if(pSearch.length < 4) {
                return;
              }
              if (foodData.description.toLowerCase().indexOf(pSearch) !== -1) {
                console.log("Found: ", pSearch, foodData.description);
                match = true;
                scoreMultiplier = parts.length;
              }
            })
          }
          if (!match) {
            return;
          }

          foodData._score = foodData.description.split(" ").length * scoreMultiplier;
          if (
              foodNutrientDataMap[foodData.fdc_id]
          ) {
            foodData._score *= .5;
          }
          const RAW = ', raw';
          if (
              foodData.description.substr(foodData.description.lenght - RAW.length) === RAW
          ) {
            foodData._score *= .5;
          }
          foodData._search = search;
          foundFoodData.push(foodData);
          if (foodData.description.toLowerCase().trim() === search) {
            foodData._exact = true;
            cropSpecies.fdcIds.push(foodData.fdc_id);
          }
        });
      });
      /* const topFoodData = foundFoodData.reduce(
        (previousValue, currentValue, currentIndex, array) => {
          if (!previousValue) {
            return currentValue;
          }
          if (previousValue._score > currentValue._score) {
            return currentValue;
          }
          return previousValue;
        }
      );*/
      console.log(cropSpecies.name, foundFoodData.length);
      foundFoodData.sort((a, b) => {
        return a._score - b._score;
      });
      foundFoodData = foundFoodData.slice(0, 5);
      if (foundFoodData.length > 0) {
        foundCount += 1;
      }

      foundFoodData.forEach((foodData) => {
        foodData._score2 = 0;
        foodNutrientDatas.forEach((d) => {
          if (parseInt(foodData.fdc_id) != parseInt(d.fdc_id)) {
            return;
          }
          foodData._score2 += 1;
          foodData.nutrients = foodData.nutrients || [];
          foodData.attributes = foodData.attributes || {}
          foodData.nutrients.push(d);
          d.nutrientData = nutrientMap[d.nutrient_id];
          if (nMap[d.nutrient_id]) {
            foodData.attributes[nMap[d.nutrient_id]] = d.amount + ' ' + nutrientMap[d.nutrient_id].unit_name;
          }
        });
        brandedDatas.forEach((d) => {
          if (parseInt(foodData.fdc_id) != parseInt(d.fdc_id)) {
            return;
          }
          foodData._score2 += 1;
          foodData.brandedData = d;
          foodData.attributes = foodData.attributes || {};
          foodData.attributes.serving = d.household_serving_fulltext;
        });
        foodPortionDatas.forEach((d) => {
          if (parseInt(foodData.fdc_id) != parseInt(d.fdc_id)) {
            return;
          }
          foodData._score2 += 1;
          foodData.foodPortionData = d;
          foodData.attributes = foodData.attributes || {};
          foodData.attributes.portion_amount = d.amount;
          foodData.attributes.portion_unit = measureUnitMap[d.measure_unit_id].name;
        });
      });
      foundFoodData.sort((a, b) => {
        return b._score2 - a._score2 ;
      });
      if (foundFoodData.length > 0) {
        cropSpecies.fdcId = foundFoodData[0].fdc_id;
        cropSpecies.fdc = foundFoodData[0];
        cropSpecies.attributes = foundFoodData[0].attributes;
      }
      cropSpecies.tmp = JSON.stringify(foundFoodData, null, 3);
      await cropSpecies.save();
    }
    console.log("foundCount: ", foundCount);

    return cropSpeciesColl;
  }
  parseCSV(filePath) {
    const csv = require("csv-parser");
    const fs = require("fs");
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("error", (err) => {
          return reject(err);
        })
        .on("end", () => {
          return resolve(results);
          // [
          //   { NAME: 'Daffy Duck', AGE: '24' },
          //   { NAME: 'Bugs Bunny', AGE: '22' }
          // ]
        });
    });
  }



  testPopulateNutritionDataLoader(ctx: any) {
    const dataLoaderNamespace = "testPopulateNutrition:DataLoader";
    ctx.dataLoaders = ctx.dataLoaders || [];
    ctx.dataLoaders[dataLoaderNamespace] =
      ctx.dataLoaders[dataLoaderNamespace] ||
      new DataLoader(async (cropSpeciesColl) => {
        const nutrientDatas: any = await this.parseCSV(
            "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/nutrient.csv"
        );
        const nutrientMap: any = {};
        nutrientDatas.forEach((nutrientData) => {
          nutrientMap[nutrientData.id] = nutrientData;
        })
        const foodDatas: any = await this.parseCSV(
          "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/food_portion.csv"
        );
        const foodNutrientDatas: any = await this.parseCSV(
          "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/food_nutrient.csv"
        );
        const brandedDatas: any = await this.parseCSV(
            "/home/user1a/WebstormProjects/gardenplanner-lambda/data/kcals/data/branded_food.csv"
        );
        return cropSpeciesColl.map((cropSpecies: any) => {
          if (!cropSpecies.fdcIds || !cropSpecies.fdcIds.length) {
            return [];
          }
          const matchedFoodDatas = foodDatas.filter((d) => {
            /*console.log(
              "parseInt(d.fdc_id):",
              parseInt(d.fdc_id),
              cropSpecies.fdcIds,
              cropSpecies.fdcIds.indexOf(parseInt(d.fdc_id))
            );*/
            return cropSpecies.fdcIds.indexOf(parseInt(d.fdc_id)) !== -1;
          });
          const matchedFoodNutrientDatas = foodNutrientDatas.filter((d) => {
            return cropSpecies.fdcIds.indexOf(parseInt(d.fdc_id)) !== -1;
          });
          const matchedBrandedDatas = brandedDatas.filter((d) => {
            /*console.log(
              "parseInt(d.fdc_id):",
              parseInt(d.fdc_id),
              cropSpecies.fdcIds,
              cropSpecies.fdcIds.indexOf(parseInt(d.fdc_id))
            );*/
            return cropSpecies.fdcIds.indexOf(parseInt(d.fdc_id)) !== -1;
          });
          matchedFoodNutrientDatas.forEach((d) => {
            d.nutrientData = nutrientMap[d.nutrient_id];
          });
          return {
            nutrients: matchedFoodNutrientDatas,
            portions: matchedFoodDatas,
            branded: matchedBrandedDatas
          };
        });
      });
    return ctx.dataLoaders[dataLoaderNamespace];
  }
}
