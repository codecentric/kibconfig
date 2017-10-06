import program from 'commander';
import util from 'util';

import KibanaClient from './lib/KibanaClient';
import createConfig from './lib/createConfig';
import DataDirectory from './lib/DataDirectory';

import PullCommand from './commands/PullCommand';
import PushCommand from './commands/PushCommand';
import DeleteCommand from './commands/DeleteCommand';
import CopyCommand from './commands/CopyCommand';

function execute(command) {
    command
        .execute()
        .then(() => {
            process.exit(0);
        })
        .catch(err => {
            console.error(err.stack || err);
            process.exit(1);
        });
}

function multiValueOption() {
    const list = [];
    const add = val => {
        list.push(val);
        return list;
    };

    return add;
}
program
    .option('--datadir <datadir>', 'Set data dir', null, './data')
    .option('--url <url>', 'Kibana server URL', null, null)
    .option('--query <query>', 'Search Query for entry IDs', null, '*')
    .option('--verbose', 'Show more information', null)
    .option('--delete', 'Delete remote entries matching the query which are not pushed', null);

program
    .command('pull [profile]')
    .description('Pulls all config objects to the local <datadir>')
    .action((profile, options) => {
        const config = createConfig(program, profile, options);
        const client = new KibanaClient(config);
        const dataDirectory = new DataDirectory(config);
        const cmd = new PullCommand(config, client, dataDirectory);

        execute(cmd);
    });

program
    .command('push [profile]')
    .description('Pushes all local config objects to the remote server')
    .action((profile, options) => {
        const config = createConfig(program, profile, options);
        const client = new KibanaClient(config);
        const dataDirectory = new DataDirectory(config);
        const cmd = new PushCommand(config, client, dataDirectory);

        execute(cmd);
    });

program
    .command('delete [profile]')
    .description('Deletes all config objects specified by query the remote server')
    .action((profile, options) => {
        const config = createConfig(program, profile, options);
        const client = new KibanaClient(config);
        const cmd = new DeleteCommand(config, client);

        execute(cmd);
    });

program
    .command('copy <profile> <type> <id>')
    .description(`Copies the given exported file into a new location replacing it's ID.

  Examples:

    $ kibconfig copy pp dashboard Existing-dashboard --replace '^Existing:New'
    $ kibconfig copy --deep pp dashboard Existing-dashboard --replace '^Existing:New' --ignore 'Navigation,Footer' --dry-run`)
    .option('--deep', 'Deep copy', null)
    .option('--replace <pattern>:<replacement>', 'Replacement', multiValueOption())
    .option('--ignore <id>,...', 'Ignored IDs', null)
    .option('--dry-run', 'Dry run', null)
    .action((profile, type, id, options) => {
        const config = createConfig(program, profile, options);
        const dataDirectory = new DataDirectory(config);
        const cmd = new CopyCommand(config, dataDirectory, type, id, options);

        execute(cmd);
    });

program
    .command('config [profile]')
    .description('Displays the used configuration')
    .action((profile, options) => {
        const config = createConfig(program, profile, options);

        console.log(util.inspect(config, { depth: null }));
    });

program.parse(process.argv);

if (!program.args.length) program.help();
