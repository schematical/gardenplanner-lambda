import 'reflect-metadata';
import {Container, Inject, Service} from "typedi";
import {CropSpecies, CropSpeciesSewMethods} from "./CropSpecies.entity";
import * as fs from "fs";
import {BaseService} from "../../../libs/Base.service";

@Service('CropSpeciesService')
export class CropSpeciesService extends BaseService(CropSpecies){
    @Inject('CropSpeciesModel')
    private cropSpeciesModel;

    constructor(

    ) {
        super();
    }

    async importTest() {
        await this.cropSpeciesModel.remove({});
        const cropDatas = JSON.parse(fs.readFileSync('/home/user1a/WebstormProjects/gardenplanner-lambda/data/crops/crops.json').toString());
        let cropSpeciesColl: CropSpecies[] = [];
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
        cropSpeciesColl = await this.cropSpeciesModel.create(cropSpeciesColl);
        for (const cropSpecies of cropSpeciesColl) {
            const cropData = cropDatas.find((c) => ('v0.1:' + c.index) === cropSpecies.importId);
            if (!cropData) {
                throw new Error("Could not find a cropData with importId matching: " + cropSpecies.importId);
            }
            const realCompatable = [];
            if (cropData.compatable) {
                cropData.compatable.forEach((compatableIndex) => {
                    const foundCropSpecies = cropSpeciesColl.find((c) => ('v0.1:' + compatableIndex) === c.importId);
                    if (!foundCropSpecies) {
                        throw new Error("Could not find a cropSpecies with importId matching: " + compatableIndex);
                    }
                    realCompatable.push(foundCropSpecies._id);
                });
                cropSpecies.compatibleCropSpecieIds = realCompatable;

            }

            if (cropData.avoid) {
                const realAvoid = [];
                cropData.avoid.forEach((avoidIndex) => {
                    const foundCropSpecies = cropSpeciesColl.find((c) => ('v0.1:' + avoidIndex) === c.importId);
                    if (!foundCropSpecies) {
                        throw new Error("Could not find a cropSpecies with importId matching: " + avoidIndex);
                    }
                    realAvoid.push(foundCropSpecies._id);
                });
                cropSpecies.avoidCropSpecieIds = realAvoid;
            }

        }
        await this.cropSpeciesModel.bulkSave(cropSpeciesColl);
        return cropSpeciesColl;
    }

}