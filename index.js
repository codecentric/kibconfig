#!/usr/bin/env node

const
    program = require('commander'),
    request = require('superagent'),
    co = require('co'),
    fsp = require('fs-promise');

function idToFilename(id) {
    return id
            .replace('_', '_')
            .replace('*', '_')
            .replace('(', '_')
            .replace(')', '_');
}

function createDirectories(targetDir, entries) {
    return co(function* () {
        for (let i = 0; i < entries.length; i++) {
            const
                type = entries[i]._type,
                typeDir = `${targetDir}/${type}`;

            if (!(yield fsp.exists(typeDir))) {
                console.log(`Creating directory ${typeDir}`);
                yield fsp.mkdir(typeDir);
            }
        }
        return entries;
    });
}

function mapToLocal(source) {
    let target = JSON.parse(JSON.stringify(source));

    if (target.panelsJSON) {
        target.panelsJSON = JSON.parse(target.panelsJSON);
    }
    if (target.kibanaSavedObjectMeta && target.kibanaSavedObjectMeta.searchSourceJSON) {
        target.kibanaSavedObjectMeta.searchSourceJSON =
            JSON.parse(target.kibanaSavedObjectMeta.searchSourceJSON);
    }
    return target;
}

function storeEntry(targetDir, entry) {
    if (entry._type) {
        const
            filename = `${targetDir}/${entry._type}/${idToFilename(entry._id)}.json`,
            content = JSON.stringify(mapToLocal(entry._source), null, 4);

        console.log(`Updating ${filename}`);
        return fsp.writeFile(filename, content, 'utf8');
    }
    return Promise.resolve();
}

function pull(command, options) {
    const
        baseUrl = command.url,
        targetDir = './data';

    console.log(`Pulling from ${baseUrl}`);
    request
        .get(`${baseUrl}/.kibana/_search?size=1000&q=*`)
        .set('Accept', 'application/json')
        .end(function (err, res) {
            const entries = res.body.hits.hits;

            createDirectories(targetDir, entries)
                .then(() => Promise.all(entries.map(storeEntry.bind(this, targetDir))))
                .then(() => {
                    process.exit(0);
                })
                .catch(err => {
                    console.error(err);
                    process.exit(1);
                });
        });
}

program
    .command('pull')
    .description('Pull ')
    .option('--url <url>', 'Kibana server URL')
    .action(pull);

program.parse(process.argv);

if (!program.args.length) program.help();
