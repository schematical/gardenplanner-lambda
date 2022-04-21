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
        const datas = JSON.parse(fs.readFileSync('/home/user1a/WebstormProjects/gardenplanner-lambda/data/city/export.json').toString());
        let geoLocationColl: GeoLocation[] = [];
        datas.forEach((cityData) => {
            const geoLocation = new GeoLocation();

            geoLocation.importId = 'v0.1:' + cityData.id;
            geoLocation.city = cityData.city;
            geoLocation.country = cityData.country
            geoLocation.location = [ parseFloat(cityData.lng), parseFloat(cityData.lat) ]; // { type: "Point", coordinates: [[ cityData.lat, cityData.lng]]}
            geoLocation.exactMatch = cityData.exactMatch;
            geoLocationColl.push(geoLocation);
        });
        geoLocationColl = await this.geoLocationModel.create(geoLocationColl);
        for (const geoLocation of geoLocationColl) {
            const cityData = datas.find((c) => ('v0.1:' + c.id) === geoLocation.importId);
            if (!cityData) {
                throw new Error("Could not find a cropData with importId matching: " + cityData.importId);
            }
            if (cityData.nearestMatch) {
                const found= geoLocationColl.find((c) => ('v0.1:' + cityData.nearestMatch.id) === c.importId);
                geoLocation.nearestMatchGeoLocationId = found._id as any;
            }
        }
        await this.geoLocationModel.bulkSave(geoLocationColl);
        console.log("geoLocationColl: ", geoLocationColl);
        return geoLocationColl;
    }

}