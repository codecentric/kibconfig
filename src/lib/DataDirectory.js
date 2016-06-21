import * as fsp from 'fs-promise';

export default class DataDirectory {
    constructor(config) {
        this.datadir = config.datadir;
        this.verbose = config.verbose;
    }

    async findAll() {
        const updatedSearches = await this.findElementsOfType('search');
        const updatedVisualizations = await this.findElementsOfType('visualization');
        const updatedDashboards = await this.findElementsOfType('dashboard');

        return [ ...updatedSearches, ...updatedVisualizations, ...updatedDashboards ];

    }

    async store(type, id, jsonContent) {
        const content = JSON.stringify(jsonContent, null, 4);
        const typedir = `${this.datadir}/${type}`;
        const name = DataDirectory.idToFilename(id);
        const filename = `${typedir}/${name}.json`;

        if (this.verbose) {
            console.log(`Updating ${filename}`);
        }

        await this.mkdirIfMissing(this.datadir);
        await this.mkdirIfMissing(typedir);
        await fsp.writeFile(filename, content, 'utf8');
    }

    async mkdirIfMissing(path) {
        const exists = await fsp.exists(path);

        if (!exists) {
            await fsp.mkdir(path);
        }
    }

    static idToFilename(id) {
        return id
            .replace('_', '_')
            .replace('*', '_')
            .replace('(', '_')
            .replace(')', '_');
    }

    async findElementsOfType(type) {
        const directory = `${this.datadir}/${type}`;
        const exists = await fsp.exists(directory);

        if (exists) {
            const files = (await fsp.readdir(directory)).filter(name => name.endsWith('.json'));

            return await Promise.all(files.map(this.loadFile.bind(this, type)));
        }
        return [];
    }

    async loadFile(type, name) {
        const text = await fsp.readFile(`${this.datadir}/${type}/${name}`, 'utf8');
        const content = JSON.parse(text);
        const id = content.id;

        return { id, type, content };
    }
}
