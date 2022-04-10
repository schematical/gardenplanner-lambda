import 'reflect-metadata';
import { Inject, Service} from "typedi";
import {GeoLocation } from "./GeoLocation.entity";
import * as fs from "fs";

@Service()
export class GeoLocationService {

    constructor(
        @Inject('GeoLocationModel')
        private GeoLocationModel
    ) {

    }
    async find() {
        const response = await this.GeoLocationModel.find();
        console.log("RESPONSE: ", response);
        return response;
    }

    async importTest() {
        const cropDatas = JSON.parse(fs.readFileSync('/home/user1a/WebstormProjects/gardenplanner-lambda/data/crops/crops.json').toString());
        const GeoLocationColl: GeoLocation[] = [];
        cropDatas.forEach((cropData) => {
            const geoLocation = new GeoLocation();
            geoLocation.city = cropData.city;
            geoLocation.importId = 'v0.1:' + cropData.index;


            GeoLocationColl.push(geoLocation);

        });
        await this.GeoLocationModel.create(GeoLocationColl);
        return GeoLocationColl;
    }

    async create() {
        const geoLocation = new GeoLocation();
        geoLocation.city = 'Shabado';
        const response = await this.GeoLocationModel.create(geoLocation);
        console.log("RESPONSE: ", response);
        return response;
    }
}