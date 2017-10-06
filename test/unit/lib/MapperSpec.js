import { expect } from 'chai';
import Samples from '../Samples';
import Mapper from '../../../src/lib/Mapper';

describe('Mapper', () => {
    describe('mapToLocal', () => {
        let hit = Samples.exampleSearchRemote();
        let result = Mapper.mapToLocal(hit);

        it('should map kibana search hits to local JSON format', () => {
            expect(result).to.deep.equal(Samples.exampleSearchLocal());
        });

        it('should add "_id" from search hit as "id" for later upload', () => {
            expect(result.id).to.equal(hit._id);
        });

        it('should replace nested JSON strings with parsed counterparts', () => {
            expect(typeof result.kibanaSavedObjectMeta.searchSourceJSON).to.equal('object');
        });
        it('should handle null values correctly', () => {
            hit = Samples.exampleSearchRemote();
            const searchSource = JSON.parse(hit._source.kibanaSavedObjectMeta.searchSourceJSON);
            const local = Samples.exampleSearchLocal();

            searchSource.filter[0].meta.alias = null;
            local.kibanaSavedObjectMeta.searchSourceJSON.filter[0].meta.alias = null;

            hit._source.kibanaSavedObjectMeta.searchSourceJSON = JSON.stringify(searchSource);

            result = Mapper.mapToLocal(hit);

            expect(result).to.deep.equal(local);
        });
    });

    describe('mapToRemote', () => {
        const result = Mapper.mapToRemote(Samples.exampleSearchLocal());

        it('should map local JSON to Kibana search hit source format', () => {
            expect(result).to.deep.equal(Samples.exampleSearchRemote()._source);
        });

        it('should replace nested JSON with stringified counterparts', () => {
            expect(typeof result.kibanaSavedObjectMeta.searchSourceJSON).to.equal('string');
        });
    });
});
