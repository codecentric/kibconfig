import { expect } from 'chai';
import { _createConfig } from '../../../src/lib/createConfig';

describe('createConfig', () => {
    const configWithProfile = {
        url: 'http://192.168.99.100:9200',
        query: 'title:Error*',
        datadir: 'global',
        delete: false,
        verbose: false,
        profiles: {
            local: {
                url: 'http://localhost:9200',
                query: 'title:Local Error*',
                datadir: 'local',
                delete: true,
                verbose: true
            }
        }
    };

    describe('precedence', () => {
        it('should return defaults', () => {
            const config = _createConfig({}, undefined, {
                url: 'http://192.168.99.100:9200'
            });

            expect(config).to.deep.equal({
                url: 'http://192.168.99.100:9200',
                query: '*',
                datadir: 'data',
                delete: false,
                verbose: false
            });
        });

        it('should return global config items if they aren\'t overridden', () => {
            const config = _createConfig({}, undefined, {
                url: 'http://192.168.99.100:9200',
                query: 'title:Error*',
                datadir: 'global',
                verbose: false
            });

            expect(config).to.deep.equal({
                url: 'http://192.168.99.100:9200',
                query: 'title:Error*',
                datadir: 'global',
                delete: false,
                verbose: false
            });
        });

        it('should use profile settings over global config', () => {
            const config = _createConfig({}, 'local', configWithProfile);

            expect(config).to.deep.equal({
                url: 'http://localhost:9200',
                query: 'title:Local Error*',
                datadir: 'local',
                delete: true,
                verbose: true
            });
        });

        it('should use program args over config', () => {
            const config = _createConfig({
                url: 'http://args:9200',
                query: 'title:args*',
                datadir: 'args',
                verbose: false,
                delete: false
            }, 'local', configWithProfile);

            expect(config).to.deep.equal({
                url: 'http://args:9200',
                query: 'title:args*',
                datadir: 'args',
                verbose: false,
                delete: false
            });
        });
    });
});
