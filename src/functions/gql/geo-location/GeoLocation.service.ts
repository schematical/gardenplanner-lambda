import 'reflect-metadata';
import {Container, Inject, Service} from "typedi";
import {CropSpecieDataByGeoLocationResponseEntry, GeoLocation} from "./GeoLocation.entity";
import * as fs from "fs";
import {BaseService} from "../../../libs/Base.service";
import {CropSpecies, CropSpeciesSewMethods} from "@functions/gql/crop-species/CropSpecies.entity";
import {mongoose} from "@typegoose/typegoose";

@Service('GeoLocationService')
export class GeoLocationService extends BaseService(GeoLocation){
    @Inject('GeoLocationModel')
    private geoLocationModel;
    @Inject('CropSpeciesModel')
    private cropSpeciesModel;

    constructor(

    ) {
        super();
    }

    async importTest() {
        await this.geoLocationModel.deleteMany({});
        const datas = JSON.parse(fs.readFileSync('/home/user1a/WebstormProjects/gardenplanner-lambda/data/city/export.json').toString());
        /*const datas = [];
        const searchId = '1392685764';
        rawDatas.forEach((rawData) => {
            if (
                rawData.id ===  searchId ||
                rawData.nearestMatch?.id === searchId
            ) {
                datas.push(rawData);
            }

        });*/
        let geoLocationColl: GeoLocation[] = [];
        const rawDataMap = {};
        const exactMatchMap = {};
        datas.forEach((cityData) => {
            const geoLocation = new GeoLocation();

            geoLocation.importId = 'v0.1:' + cityData.id;
            geoLocation.city = cityData.city;
            geoLocation.country = cityData.country
            geoLocation.location = [ parseFloat(cityData.lng), parseFloat(cityData.lat) ]; // { type: "Point", coordinates: [[ cityData.lat, cityData.lng]]}
            geoLocation.exactMatch = cityData.exactMatch;
            geoLocationColl.push(geoLocation);

            rawDataMap[geoLocation.importId] = cityData;
        });
        geoLocationColl = await this.geoLocationModel.create(geoLocationColl);
        geoLocationColl.forEach((geoLocation) => {
            if (geoLocation.exactMatch) {
                exactMatchMap[geoLocation.importId] = geoLocation;
            }
        });
        let saveBatch = [];
        for (const geoLocation of geoLocationColl) {
            const cityData = rawDataMap[geoLocation.importId]; // datas.find((c) => ('v0.1:' + c.id) === geoLocation.importId);

            if (!cityData) {
                throw new Error("Could not find a cityData with importId matching: " + cityData.importId);
            }
            if (cityData.nearestMatch) {
                const found = exactMatchMap['v0.1:' + cityData.nearestMatch.id];// geoLocationColl.find((c) => ('v0.1:' + cityData.nearestMatch.id) === c.importId);
                if (!found) {
                    throw new Error("Could not find a nearestMatch with importId matching: " + cityData.nearestMatch.id);
                }

                geoLocation.nearestMatchGeoLocationId = found._id;
            }
            saveBatch.push(geoLocation);
            if (saveBatch.length > 100) {
                await this.geoLocationModel.bulkSave(saveBatch);
                saveBatch = [];
            }
        }

        await this.geoLocationModel.bulkSave(saveBatch);
        return geoLocationColl;
    }

    async getCropSpecieDataByGeoLocation(ctx, geoLocationId: mongoose.Schema.Types.ObjectId) {
        const baseGeoLocation = await this.geoLocationModel.findOne({_id: geoLocationId});
        if (!baseGeoLocation) {
            return null;
        }
        let geoLocation = baseGeoLocation;
        if (baseGeoLocation.nearestMatchGeoLocationId) {
            geoLocation = await this.geoLocationModel.findOne({_id: baseGeoLocation.nearestMatchGeoLocationId});
            if (!geoLocation) {
                throw new Error("Could not find GeoLocation" + baseGeoLocation.nearestMatchGeoLocationId + " referenced by " + baseGeoLocation._id)
            }
            if (!geoLocation.exactMatch) {
                throw new Error("GeoLocation" + baseGeoLocation.nearestMatchGeoLocationId + " referenced by " + baseGeoLocation._id + " did not have an `exactMatch`");
            }
        }
        // TODO: This is sloppy fix
        const crops = await this.cropSpeciesModel.find({});
        return this.parseCrops(geoLocation, crops);

    }
    parseCrops(geoLocation: GeoLocation, crops: CropSpecies[]) {
        console.log(" geoLocation.exactMatch: ",  geoLocation);
        let monthMap = geoLocation.exactMatch.monthMap;
        const response: CropSpecieDataByGeoLocationResponseEntry[] = [];
        crops.forEach((crop) => {
            let tempMatchMonthCount = 0;
            const minDurationMonths = crop.harvestDayMin / 30;
            let startMonth = 1;
            let lateStartMonth = -1;
            let endMonthEnd = -1;
            let earlyStartMonth = -1;
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
                        if (earlyStartMonth === -1) {
                            earlyStartMonth = startMonth;
                        }
                        if (lateStartMonth === -1) {
                            lateStartMonth = realMonth;
                        }
                        endMonthEnd = realMonth;
                    }
                }



            }
            if (lateStartMonth !== -1) {
                response.push({
                    cropSpecies: crop,
                    earlyStartMonth,
                    lateStartMonth
                });
                console.log(crop.name + ' Start: ' + earlyStartMonth + ' End: ' + lateStartMonth + ' - ' + endMonthEnd);
            }
        });
        return response;
    }
}