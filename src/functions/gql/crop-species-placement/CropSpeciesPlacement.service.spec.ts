import {Container} from "typedi";
import {CropSpeciesPlacementService} from "./CropSpeciesPlacement.service";
import {CropSpeciesPlacement, CropSpeciesPlacementCreateInput, CropSpeciesPlacementUpdateInput} from "./CropSpeciesPlacement.entity";
import {Field} from "type-graphql/dist/decorators/Field";

describe('CropSpeciesPlacement', () => {
    let service: CropSpeciesPlacementService;
    beforeEach(() => {
        // service = Container.get('CropSpeciesPlacement');
    });
    it('should exist', () => {
        expect(service).toBeTruthy();
    });
    describe('CropSpeciesPlacement.list', () => {


        it('should list users', async () => {
            const entity = new CropSpeciesPlacementUpdateInput();
            const metadataKey = 'typegoose:properties'; // Symbol("Field");
            const metaDataResults  = Reflect.getMetadata(metadataKey, CropSpeciesPlacementUpdateInput);

            metaDataResults.forEach((r) => {

            });
        });

    });
})