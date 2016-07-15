import Mapper from '../lib/Mapper';
import promiseLimit from 'promise-limit';

const MAX_CONCURRENT_CONNECTIONS = 20;

export default class PushCommand {
    constructor(config, client, dataDirectory) {
        this.config = config;
        this.client = client;
        this.dataDirectory = dataDirectory;
    }

    async execute() {
        await this.upload();
    }

    async upload() {
        const files = await this.dataDirectory.findAll();
        const limit = promiseLimit(MAX_CONCURRENT_CONNECTIONS);

        await Promise.all(files.map(file => limit(() => this.uploadElement(file))));
        return files;
    }

    uploadElement(fileEntry) {
        const { id, type, content } = fileEntry;
        const body = Mapper.mapToRemote(content);

        return this.client.upload(type, id, body);
    }
}
