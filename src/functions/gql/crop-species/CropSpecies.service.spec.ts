import {Container} from "typedi";
import {CropSpeciesService} from "./CropSpecies.service";
import {CropSpecies, CropSpeciesCreateInput, CropSpeciesUpdateInput} from "./CropSpecies.entity";
import {Field} from "type-graphql/dist/decorators/Field";

describe('CropSpeciesService', () => {
    let service: CropSpeciesService;
    beforeEach(() => {
        // service = Container.get('CropSpeciesService');
    });
    it('should exist', () => {
        expect(service).toBeTruthy();
    });
    describe('CropSpeciesService.list', () => {


        it('should list users', async () => {
            const entity = new CropSpeciesUpdateInput();
            const metadataKey = 'typegoose:properties'; // Symbol("Field");
            const metaDataResults  = Reflect.getMetadata(metadataKey, CropSpeciesUpdateInput);

            metaDataResults.forEach((r) => {

            });
        });

    });
})