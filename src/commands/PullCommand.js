import request from '../lib/promiseRequest';
import fsp from 'fs-promise';

export default class PullCommand {
    constructor(program, command, options) {
        this.baseUrl = command.url;
        this.targetDir = './data';
    }

    async execute() {
        try {
            await this.createTargetDirectory();

            const result = await request
                .get(`${this.baseUrl}/.kibana/_search?size=1000&q=*`)
                .set('Accept', 'application/json')
                .promise();
            const entries = result.body.hits.hits;

            await this.createDirectories(this.targetDir, entries);
            await Promise.all(entries.map(this.storeEntry.bind(this)));
            process.exit(0);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

    async createTargetDirectory() {
        if (!(await fsp.exists(this.targetDir))) {
            await fsp.mkdir(this.targetDir);
        }
    }

    async storeEntry(entry) {
        if (entry._type) {
            const filename = `${this.targetDir}/${entry._type}/${this.idToFilename(entry._id)}.json`;
            const content = JSON.stringify(this.mapToLocal(entry._source), null, 4);

            console.log(`Updating ${filename}`);
            await fsp.writeFile(filename, content, 'utf8');
        }
    }

    idToFilename(id) {
        return id
            .replace('_', '_')
            .replace('*', '_')
            .replace('(', '_')
            .replace(')', '_');
    }


    async createDirectories(targetDir, entries) {
        for (let i = 0; i < entries.length; i++) {
            const type = entries[i]._type;
            const typeDir = `${targetDir}/${type}`;

            if (!(await fsp.exists(typeDir))) {
                console.log(`Creating directory ${typeDir}`);
                await fsp.mkdir(typeDir);
            }
        }
        return entries;
    }

    mapToLocal(source) {
        const target = JSON.parse(JSON.stringify(source));

        if (target.panelsJSON) {
            target.panelsJSON = JSON.parse(target.panelsJSON);
        }
        if (target.kibanaSavedObjectMeta && target.kibanaSavedObjectMeta.searchSourceJSON) {
            target.kibanaSavedObjectMeta.searchSourceJSON =
                JSON.parse(target.kibanaSavedObjectMeta.searchSourceJSON);
        }
        return target;
    }
}