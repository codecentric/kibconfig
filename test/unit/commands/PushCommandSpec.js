import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import PushCommand from '../../../src/commands/PushCommand';
import Samples from '../Samples';
import Mapper from '../../../src/lib/Mapper';

describe('PushCommand', () => {
    let config,
        clientStub,
        dataDirectoryStub,
        command;

    beforeEach(() => {
        config = {};
        clientStub = {
            upload: sinon.stub()
        };
        dataDirectoryStub = {
            findAll: sinon.stub()
        };
        command = new PushCommand(config, clientStub, dataDirectoryStub);
    });

    it('should store all local files into the data directory in mapped form', () => {
        const files = Samples.exampleFiles();

        dataDirectoryStub.findAll.resolves(files);
        clientStub.upload.resolves();

        return command.execute().then(() => {
            expect(clientStub.upload).to.have.been.calledWith('search', 'id1', Mapper.mapToRemote(files[0].content));
            expect(clientStub.upload).to.have.been.calledWith('search', 'id2', Mapper.mapToRemote(files[1].content));
        });
    });
});
