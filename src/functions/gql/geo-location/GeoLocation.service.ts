import 'reflect-metadata';
import {Container, Inject, Service} from "typedi";
import {GeoLocation } from "./GeoLocation.entity";
import * as fs from "fs";
import {BaseService} from "../../../libs/Base.service";
import {CropSpecies, CropSpeciesSewMethods} from "@functions/gql/crop-species/CropSpecies.entity";

@Service('GeoLocationService')
export class GeoLocationService extends BaseService(GeoLocation){
    @Inject('GeoLocationModel')
    private geoLocationModel;

    constructor(

    ) {
        super();
    }

    async importTest() {
        await this.geoLocationModel.deleteMany({});
        const rawDatas = JSON.parse(fs.readFileSync('/home/user1a/WebstormProjects/gardenplanner-lambda/data/city/export.json').toString());
        const datas = [];
        const searchId = '1392685764';
        rawDatas.forEach((rawData) => {
            if (
                rawData.id ===  searchId ||
                rawData.nearestMatch?.id === searchId
            ) {
                datas.push(rawData);
            }

        });
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
        // console.log("KEYS: ", Object.keys(rawDataMap));
        geoLocationColl = await this.geoLocationModel.create(geoLocationColl);
        geoLocationColl.forEach((geoLocation) => {
            if (geoLocation.exactMatch) {
                exactMatchMap[geoLocation.importId] = geoLocation;
            }
        });
        for (const geoLocation of geoLocationColl) {
            const cityData = rawDataMap[geoLocation.importId]; // datas.find((c) => ('v0.1:' + c.id) === geoLocation.importId);
            console.log(geoLocation.importId, cityData);
            if (!cityData) {
                throw new Error("Could not find a cityData with importId matching: " + cityData.importId);
            }
            if (cityData.nearestMatch) {
                const found = exactMatchMap['v0.1:' + cityData.nearestMatch.id];// geoLocationColl.find((c) => ('v0.1:' + cityData.nearestMatch.id) === c.importId);
                if (!found) {
                    throw new Error("Could not find a nearestMatch with importId matching: " + cityData.nearestMatch.id);
                }
                console.log("FOUND: ", found);
                geoLocation.nearestMatchGeoLocationId = found._id;
            }
        }
        await this.geoLocationModel.bulkSave(geoLocationColl);

        return geoLocationColl;
    }

}