import request from '../lib/promiseRequest';
import fsp from 'fs-promise';

export default class PushCommand {
    constructor(program) {
        this.baseUrl = program.url;
        this.dataDir = program.datadir || './data';
    }

    static register(program) {
        program
            .command('push')
            .description('Pushes all local config objects to the remote server')
            .action((command, options) => {
                new PushCommand(program, command, options).execute();
            });
    }

    async execute() {
        try {
            await this.uploadElementsOfType('search');
            await this.uploadElementsOfType('visualization');
            await this.uploadElementsOfType('dashboard');
        } catch (err) {
            console.error(err);
        }
    }

    async uploadElementsOfType(type) {
        const directory = `${this.dataDir}/${type}`;
        const exists = await fsp.exists(directory);

        console.log(`Uploading ${type} directory`);

        if (exists) {
            const files = (await fsp.readdir(directory)).filter(name => name.endsWith('.json'));

            await Promise.all(files.map(name => this.uploadElement(type, name)));
        }
    }

    async uploadElement(type, name) {
        const text = await fsp.readFile(`${this.dataDir}/${type}/${name}`, 'utf8');
        const content = JSON.parse(text);
        const id = content.id;
        const body = PushCommand.mapToRemote(content);
        const url = `${this.baseUrl}/.kibana/${type}/${id}`;

        console.log(`Uploading '${id}' to ${url}`);
        await request.put(url).send(body).promise();
    }

    static mapToRemote(content) {
        const target = JSON.parse(JSON.stringify(content));

        delete target.id;
        if (target.visState) {
            target.visState = JSON.stringify(target.visState);
        }
        PushCommand.replaceJsWithJson(target);
        if (target.kibanaSavedObjectMeta) {
            PushCommand.replaceJsWithJson(target.kibanaSavedObjectMeta);
        }
        return target;
    }

    static replaceJsWithJson(target) {
        Object.keys(target).forEach(key => {
            if (key.endsWith('JSON')) {
                target[key] = JSON.stringify(target[key]); // eslint-disable-line no-param-reassign
            }
        });
    }

}
