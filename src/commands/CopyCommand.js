
export default class PullCommand {
    constructor(config, dataDirectory, type, id, options) {
        this.config = config;
        this.dataDirectory = dataDirectory;
        this.type = type;
        this.id = id;
        this.replacements = options.replace || [];
        this.ignores = (options.ignore || '').split(',');
        this.deep = options.deep;
        this.dryRun = options.dryRun;
        console.log(options.replace);

        this.changedEntries = [];
    }

    async execute() {
        this.entries = await this.dataDirectory.findAll();

        this.copy(this.type, this.id);

        if (this.dryRun) {
            console.log(this.changedEntries);
        } else {
            await this.storeChanges();
        }
    }

    copy(type, id) {
        const entry = this.entries.find(it => it.type === type && it.id === id);
        if (this.ignores.indexOf(id) !== -1) {
            console.log(`${type} ${id} ignored`);
            return entry;
        }

        const newId = this.replaceId(id);

        if (!entry) {
            throw new Error(`${type} ${id} not found`);
        }
        if (newId === id) {
            throw new Error(`Replacements '${JSON.stringify(this.replacements)}' do not match for id ${id}`);
        }

        const existingNewEntry = this.entries.find(it => it.type === type && it.id === newId);
        if (existingNewEntry) {
            console.log(`${type} ${newId} already exists - skipping`);
            return existingNewEntry;
        }
        const alreadyConvertedEntry = this.changedEntries.find(it => it.type === type && it.id === newId);
        if (alreadyConvertedEntry) {
            console.log(`${type} ${newId} was already converted - skipping`);
            return alreadyConvertedEntry;
        }

        console.log(`Copying ${type} ${id} to ${newId}`);

        let newEntry = {
            ...entry,
            id: newId,
            content: {
                ...entry.content,
                id: newId
            }
        };

        if (this.deep) {
            newEntry = this.replaceChildren(newEntry);
        }

        this.changedEntries.push(newEntry);
        return newEntry;
    }

    replaceId(id) {
        let newId = id;
        this.replacements.forEach(replacement => {
            const [ before, after ] = replacement.split(':');
            newId = newId.replace(new RegExp(before), after);
        });
        return newId;
    }

    replaceChildren(entry) {
        switch (entry.type) {
        case 'dashboard':
            return this.replaceChildrenOfDashboard(entry);
        case 'visualization':
            return this.replaceChildrenOfVisualization(entry);
        default:
            return entry;
        }
    }

    replaceChildrenOfDashboard(entry) {
        return {
            ...entry,
            content: {
                ...entry.content,
                panelsJSON: entry.content.panelsJSON.map(panel => {
                    const changedEntry = this.copy(panel.type, panel.id);

                    return {
                        ...panel,
                        id: changedEntry.id
                    };
                })
            }
        };
    }

    replaceChildrenOfVisualization(entry) {
        const searchId = entry.content.savedSearchId;
        if (searchId) {
            const changedEntry = this.copy('search', searchId);

            return {
                ...entry,
                content: {
                    ...entry.content,
                    savedSearchId: changedEntry.id
                }
            };
        }
        return entry;
    }

    storeChanges() {
        return Promise.all(
            this.changedEntries.map(entry => this.dataDirectory.store(entry.type, entry.id, entry.content)
                    .then(() => console.log(`Wrote ${entry.type} ${entry.id} to data directory`)))
        );
    }
}
