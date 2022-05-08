import 'reflect-metadata';
import {Container, Inject, Service} from "typedi";
import {CropSpeciesPlacement,} from "./CropSpeciesPlacement.entity";
import * as fs from "fs";
import {BaseService} from "../../../libs/Base.service";

@Service('CropSpeciesPlacementService')
export class CropSpeciesPlacementService extends BaseService(CropSpeciesPlacement){
    @Inject('CropSpeciesPlacementModel')
    private CropSpeciesPlacementModel;

    constructor(

    ) {
        super();
    }


}