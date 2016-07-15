import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import PullCommand from '../../../src/commands/PullCommand';
import Samples from '../Samples';
import Mapper from '../../../src/lib/Mapper';

describe('PullCommand', () => {
    let config,
        clientStub,
        dataDirectoryStub,
        command;

    beforeEach(() => {
        config = {};
        clientStub = {
            findAll: sinon.stub()
        };
        dataDirectoryStub = {
            store: sinon.stub()
        };
        command = new PullCommand(config, clientStub, dataDirectoryStub);
    });

    it('should store all kibana entries from server into the data directory in mapped form', () => {
        const hits = Samples.exampleHits();

        clientStub.findAll.returns(hits);
        dataDirectoryStub.store.onFirstCall().returns(Promise.resolve());
        dataDirectoryStub.store.onSecondCall().returns(Promise.resolve());

        return command.execute().then(() => {
            expect(dataDirectoryStub.store).to.have.been.calledWith('search', 'id1', Mapper.mapToLocal(hits[0]));
            expect(dataDirectoryStub.store).to.have.been.calledWith('search', 'id2', Mapper.mapToLocal(hits[1]));
        });
    });
});
