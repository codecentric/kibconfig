import request from '../lib/promiseRequest';
import fsp from 'fs-promise';

export default class PullCommand {
    constructor(program) {
        this.baseUrl = program.url;
        this.query = program.query || '*';
        this.dataDir = program.datadir || './data';
    }

    static register(program) {
        program
            .command('pull')
            .description('Pulls all config objects to the local <datadir>')
            .action((command, options) => {
                new PullCommand(program, command, options).execute();
            });
    }

    async execute() {
        try {
            await this.mkdirIfMissing(this.dataDir);

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
            const filename = `${this.dataDir}/${entry._type}/${name}.json`;
            const jsonContent = PullCommand.mapToLocal(entry);
            const content = JSON.stringify(jsonContent, null, 4);

            console.log(`Updating ${filename}`);
            await fsp.writeFile(filename, content, 'utf8');
        }
    }

    createDirectories(entries) {
        const distinctTypes = Array.from(new Set(entries.map(entry => entry._type)));

        return Promise.all(
            distinctTypes.map(type => this.mkdirIfMissing(`${this.dataDir}/${type}`)));
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

    static mapToLocal(entry) {
        const source = entry._source;
        const target = Object.assign(
                { id: entry._id },
                JSON.parse(JSON.stringify(source))
            );

        if (target.visState) {
            target.visState = PullCommand.sortByKey(JSON.parse(target.visState));
        }
        PullCommand.replaceJsonWithJs(target);
        if (target.kibanaSavedObjectMeta) {
            PullCommand.replaceJsonWithJs(target.kibanaSavedObjectMeta);
        }
        return target;
    }

    static replaceJsonWithJs(target) {
        Object.keys(target).forEach(key => {
            if (key.endsWith('JSON')) {
                target[key] = PullCommand.sortByKey(JSON.parse(target[key])); // eslint-disable-line no-param-reassign
            }
        });
    }

    static sortByKey(unordered) {
        if (unordered instanceof Array) {
            return unordered.map(entry => PullCommand.sortByKey(entry));
        } else if (typeof unordered === 'object') {
            const ordered = {};

            Object.keys(unordered).sort().forEach(key => {
                ordered[key] = PullCommand.sortByKey(unordered[key]);
            });
            return ordered;
        }
        return unordered;
    }
}
