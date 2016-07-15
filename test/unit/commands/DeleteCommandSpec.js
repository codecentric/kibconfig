import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import DeleteCommand from '../../../src/commands/DeleteCommand';
import Samples from '../Samples';
import Mapper from '../../../src/lib/Mapper';

describe('DeleteCommand', () => {
    let config,
        clientStub,
        command;

    beforeEach(() => {
        config = {};
        clientStub = {
            findAll: sinon.stub(),
            delete: sinon.stub()
        };
        command = new DeleteCommand(config, clientStub);
    });

    it('should delete all kibana entries from server matching the previous search', () => {
        const hits = Samples.exampleHits();

        clientStub.findAll.resolves(hits);
        clientStub.delete.resolves();

        return command.execute().then(() => {
            expect(clientStub.delete).to.have.been.calledWith('search', 'id1');
            expect(clientStub.delete).to.have.been.calledWith('search', 'id2');
        });
    });

    it('should fail if search fails', () => {
        const hits = Samples.exampleHits();

        clientStub.findAll.rejects(new Error('findAll fails'));

        return command.execute().catch(err => {
            expect(err.message).to.equal('findAll fails');
            expect(clientStub.delete).to.not.have.been.called;
        });
    });

    it('should fail if delete fails', () => {
        const hits = Samples.exampleHits();

        clientStub.findAll.resolves(hits);
        clientStub.delete.rejects(new Error('delete fails'));

        return command.execute().catch(err => {
            expect(err.message).to.equal('delete fails');
        });
    });
});
