import fsp from 'fs-promise';
import Mapper from '../lib/Mapper';

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

        await Promise.all(files.map(this.uploadElement.bind(this)));
        return files;
    }

    uploadElement(fileEntry) {
        const { id, type, content } = fileEntry;
        const body = Mapper.mapToRemote(content);

        return this.client.upload(type, id, body);
    }
}
