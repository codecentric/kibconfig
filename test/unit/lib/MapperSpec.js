import Mapper from '../../../src/lib/Mapper';

import { expect } from 'chai';
import Samples from '../Samples';

describe('Mapper', () => {
    describe('mapToLocal', () => {
        const hit = Samples.exampleSearchRemote();
        const result = Mapper.mapToLocal(hit);

        it('should map kibana search hits to local JSON format', () => {
            expect(result).to.deep.equal(Samples.exampleSearchLocal());
        });

        it('should add "_id" from search hit as "id" for later upload', () => {
            expect(result.id).to.equal(hit._id);
        });

        it('should replace nested JSON strings with parsed counterparts', () => {
            expect(typeof result.kibanaSavedObjectMeta.searchSourceJSON).to.equal('object');
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
