import { expect } from 'chai';
import sinon from 'sinon';
import Samples from '../Samples';
import CopyCommand from '../../../src/commands/CopyCommand';

describe('CopyCommand', () => {
    let config;
    let dataDirectoryStub;
    let command;

    beforeEach(() => {
        config = {};
        dataDirectoryStub = {
            findAll: sinon.stub().resolves([]),
            store: sinon.stub().resolves()
        };
    });

    describe('dashboard', () => {
        beforeEach(() => {
            // command = new CopyCommand(config, dataDirectoryStub, 'dashboard', 'mydashboard', {});
        });

        it('should fail and do nothing if there is nothing replaced', () => {
            command = new CopyCommand(config, dataDirectoryStub, 'dashboard', 'mydashboard', {});
            return command.execute().should.be.rejected.then(err => {
                expect(dataDirectoryStub.store).to.not.have.been.called;
                expect(err.message).to.equal('No replacements specified - skipping copy');
            });
        });

        it('should fail and do nothing if there is no match for the ID', () => {
            command = new CopyCommand(config, dataDirectoryStub, 'dashboard', 'mydashboard', {
                replace: ['Example:New']
            });
            return command.execute().should.be.rejected.then(err => {
                expect(dataDirectoryStub.store).to.not.have.been.called;
                expect(err.message).to.equal('dashboard mydashboard not found');
            });
        });

        it('should copy the given entry replacing parts of the id', () => {
            dataDirectoryStub.findAll.resolves(Samples.exampleDashboardFiles());

            command = new CopyCommand(config, dataDirectoryStub, 'dashboard', 'Example-Dashboard', {
                replace: ['Example:New']
            });

            return command.execute().then(() => {
                expect(dataDirectoryStub.store.firstCall.args).to.deep.equal([
                    'dashboard',
                    'New-Dashboard',
                    {
                        ...Samples.exampleDashboard(),
                        id: 'New-Dashboard'
                    }
                ]);
            });
        });

        it('should support a dry-run', () => {
            dataDirectoryStub.findAll.resolves(Samples.exampleDashboardFiles());

            command = new CopyCommand(config, dataDirectoryStub, 'dashboard', 'Example-Dashboard', {
                dryRun: true,
                replace: ['Example:New']
            });

            return command.execute().then(() => {
                expect(dataDirectoryStub.store).to.not.have.been.called;
            });
        });

        it('should perform a deep copy the given entry replacing parts of the ids', () => {
            dataDirectoryStub.findAll.resolves(Samples.exampleDashboardFiles());

            command = new CopyCommand(config, dataDirectoryStub, 'dashboard', 'Example-Dashboard', {
                deep: true,
                replace: ['Example:New'],
                ignore: 'Navigation'
            });
            const dashboard = Samples.exampleDashboard();

            return command.execute().then(() => {
                expect(dataDirectoryStub.store).to.have.been.calledWith('dashboard', 'New-Dashboard', {
                    ...dashboard,
                    id: 'New-Dashboard',
                    panelsJSON: [
                        {
                            ...dashboard.panelsJSON[0],
                            id: 'Navigation'
                        },
                        {
                            ...dashboard.panelsJSON[1],
                            id: 'New-all-errors'
                        },
                        {
                            ...dashboard.panelsJSON[2],
                            id: 'New-Log-count-by-level'
                        }
                    ]
                });
                expect(dataDirectoryStub.store).to.have.been.calledWith('visualization', 'New-Log-count-by-level');
                expect(dataDirectoryStub.store).to.have.been.calledWith('search', 'New-all-logs');
                expect(dataDirectoryStub.store).to.have.been.calledWith('search', 'New-all-errors');
            });
        });
    });
});
