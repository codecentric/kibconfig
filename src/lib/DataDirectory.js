import fsp from 'fs-promise';
import fs from 'fs';
import stringify from 'json-stable-stringify';

const PROPERTY_ORDER = [ 'id', 'title', 'type' ];

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
        const content = stringify(jsonContent, {
            cmp: DataDirectory.compare,
            space: 4
        });
        const typedir = `${this.datadir}/${type}`;
        const name = DataDirectory.idToFilename(id);
        const filename = `${typedir}/${name}.json`;

        if (this.verbose) {
            console.log(`Updating ${filename}`);
        }

        DataDirectory.mkdirIfMissing(this.datadir);
        DataDirectory.mkdirIfMissing(typedir);
        await fsp.writeFile(filename, content, 'utf8');
    }

    static mkdirIfMissing(path) {
        const exists = fs.existsSync(path);

        if (!exists) {
            fs.mkdirSync(path);
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

            return Promise.all(files.map(this.loadFile.bind(this, type)));
        }
        return [];
    }

    async loadFile(type, name) {
        const path = `${this.datadir}/${type}/${name}`;
        if (this.verbose) {
            console.log(`Loading ${path}`);
        }

        const text = await fsp.readFile(path, 'utf8');
        const content = JSON.parse(text);
        const { id } = content;

        return { id, type, content };
    }

    static clone(entry) {
        return {
            ...entry,
            content: JSON.parse(JSON.stringify(entry.content))
        };
    }

    static compare(a, b) {
        for (const name of PROPERTY_ORDER) {
            if (a.key === name) {
                return -1;
            }
            if (b.key === name) {
                return 1;
            }
        }
        if (typeof a.value === 'object' && typeof b.value !== 'object') {
            return 1;
        }
        if (typeof b.value === 'object' && typeof a.value !== 'object') {
            return -1;
        }
        return a.key < b.key ? -1 : 1;
    }
}
