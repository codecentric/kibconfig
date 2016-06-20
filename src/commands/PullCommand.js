import request from '../lib/promiseRequest';
import fsp from 'fs-promise';

export default class PullCommand {
    constructor(program, command) {
        this.baseUrl = command.url;
        this.query = command.query;
        this.targetDir = './data';
    }

    static register(program) {
        program
            .command('pull')
            .description('Pulls all config objects to a local ./data subfolder')
            .option('--url <url>', 'Kibana server URL', null, null)
            .option('--query <query>', 'Search Query for entry IDs', null, '*')
            .action((command, options) => {
                new PullCommand(program, command, options).execute();
            });
    }

    async execute() {
        try {
            await this.mkdirIfMissing(this.targetDir);

            const url = `${this.baseUrl}/.kibana/_search?size=1000&q=${this.query}`;
            console.log(`Querying via ${url}`);

            const result = await request
                .get(url)
                .set('Accept', 'application/json')
                .promise();
            const entries = result.body.hits.hits;

            await this.createDirectories(entries);
            await Promise.all(entries.map(this.storeEntry.bind(this)));
            process.exit(0);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

    async storeEntry(entry) {
        if (entry._type) {
            const name = PullCommand.idToFilename(entry._id);
            const filename = `${this.targetDir}/${entry._type}/${name}.json`;
            const jsonContent = PullCommand.mapToLocal(entry._source);
            const content = JSON.stringify(jsonContent, null, 4);

            console.log(`Updating ${filename}`);
            await fsp.writeFile(filename, content, 'utf8');
        }
    }

    createDirectories(entries) {
        const distinctTypes = Array.from(new Set(entries.map(entry => entry._type)));

        return Promise.all(
            distinctTypes.map(type => this.mkdirIfMissing(`${this.targetDir}/${type}`)));
    }

    async mkdirIfMissing(typeDir) {
        const exists = await fsp.exists(typeDir);

        if (!exists) {
            await fsp.mkdir(typeDir);
        }
    }

    static idToFilename(id) {
        return id
            .replace('_', '_')
            .replace('*', '_')
            .replace('(', '_')
            .replace(')', '_');
    }

    static mapToLocal(source) {
        const target = JSON.parse(JSON.stringify(source));

        if (target.panelsJSON) {
            target.panelsJSON = PullCommand.sortByKey(JSON.parse(target.panelsJSON));
        }
        if (target.kibanaSavedObjectMeta && target.kibanaSavedObjectMeta.searchSourceJSON) {
            target.kibanaSavedObjectMeta.searchSourceJSON =
                PullCommand.sortByKey(JSON.parse(target.kibanaSavedObjectMeta.searchSourceJSON));
        }
        return target;
    }

    static sortByKey(unordered) {
        const ordered = {};

        Object.keys(unordered).sort().forEach(function(key) {
            ordered[key] = unordered[key];
        });
        return ordered;
    }
}
