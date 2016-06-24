
export default class DeleteCommand {
    constructor(config, client) {
        this.config = config;
        this.client = client;
    }

    async execute() {
        const entries = await this.client.findAll();

        await Promise.all(entries.map(this.deleteEntry.bind(this)));
    }

    async deleteEntry(entry) {
        const type = entry._type;
        const id = entry._id;

        if (type && id) {
            await this.client.delete(type, id);
        }
    }
}
