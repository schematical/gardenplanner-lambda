import 'reflect-metadata';
import { Inject, Service} from "typedi";
import {CropSpecies, CropSpeciesSewMethods} from "./CropSpecies.entity";
import * as fs from "fs";

@Service()
export class CropSpeciesService {

    constructor(
        @Inject('CropSpeciesModel')
        private cropSpeciesModel
    ) {

    }
    async find() {
        const response = await this.cropSpeciesModel.find();
        console.log("RESPONSE: ", response);
        return response;
    }

    async importTest() {
        const cropDatas = JSON.parse(fs.readFileSync('/home/user1a/WebstormProjects/gardenplanner-lambda/data/crops/crops.json').toString());
        const cropSpeciesColl: CropSpecies[] = [];
        cropDatas.forEach((cropData) => {
            const cropSpecies = new CropSpecies();
            cropSpecies.name = cropData.name;
            cropSpecies.importId = 'v0.1:' + cropData.index;
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
        await this.cropSpeciesModel.create(cropSpeciesColl);
        return cropSpeciesColl;
    }

    async create() {
        const cropSpecies = new CropSpecies();
        cropSpecies.name = 'Shabado';
        const response = await this.cropSpeciesModel.create(cropSpecies);
        console.log("RESPONSE: ", response);
        return response;
    }
}