import Mapper from '../lib/Mapper';

export default class PullCommand {
    constructor(config, client, dataDirectory) {
        this.config = config;
        this.client = client;
        this.dataDirectory = dataDirectory;
    }

    async execute() {
        const entries = await this.client.findAll();

        await Promise.all(entries.map(this.storeEntry.bind(this)));
    }

    async storeEntry(entry) {
        if (entry._type) {
            const jsonContent = Mapper.mapToLocal(entry);

            await this.dataDirectory.store(entry._type, entry._id, jsonContent);
        }
    }
}
