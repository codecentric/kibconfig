import program from 'commander';
import request from './promiseRequest';
import fsp from 'fs-promise';

function idToFilename(id) {
    return id
            .replace('_', '_')
            .replace('*', '_')
            .replace('(', '_')
            .replace(')', '_');
}

async function createTargetDirectory(targetDir) {
    if (!(await fsp.exists(targetDir))) {
        await fsp.mkdir(targetDir);
    }
}

async function createDirectories(targetDir, entries) {
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

function mapToLocal(source) {
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

async function storeEntry(targetDir, entry) {
    if (entry._type) {
        const filename = `${targetDir}/${entry._type}/${idToFilename(entry._id)}.json`;
        const content = JSON.stringify(mapToLocal(entry._source), null, 4);

        console.log(`Updating ${filename}`);
        await fsp.writeFile(filename, content, 'utf8');
    }
}

async function pull(command) {
    const baseUrl = command.url;
    const targetDir = './data';

    try {
        await createTargetDirectory(targetDir);

        const result = await request
                .get(`${baseUrl}/.kibana/_search?size=1000&q=*`)
                .set('Accept', 'application/json')
                .promise();
        const entries = result.body.hits.hits;

        await createDirectories(targetDir, entries);
        await Promise.all(entries.map(storeEntry.bind(this, targetDir)));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

program
    .command('pull')
    .description('Pulls all config objects to a local ./data subfolder')
    .option('--url <url>', 'Kibana server URL', null, null)
    .action(pull);

program.parse(process.argv);

if (!program.args.length) program.help();
