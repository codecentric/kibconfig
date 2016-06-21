import program from 'commander';
import PullCommand from './commands/PullCommand';
import PushCommand from './commands/PushCommand';
import KibanaClient from './lib/KibanaClient';
import createConfig from './lib/createConfig';
import DataDirectory from './lib/DataDirectory';
import * as util from 'util';

function execute(command) {
    command
        .execute()
        .then(() => {
            process.exit(0);
        })
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
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
    .action((command, options) => {
        const config = createConfig(program, command, options);
        const client = new KibanaClient(config);
        const dataDirectory = new DataDirectory(config);
        const cmd = new PullCommand(config, client, dataDirectory);

        execute(cmd);
    });

program
    .command('push [profile]')
    .description('Pushes all local config objects to the remote server')
    .action((command, options) => {
        const config = createConfig(program, command, options);
        const client = new KibanaClient(config);
        const dataDirectory = new DataDirectory(config);
        const cmd = new PushCommand(config, client, dataDirectory);

        execute(cmd);
    });

program
    .command('config [profile]')
    .description('Displays the used configuration')
    .action((command, options) => {
        const config = createConfig(program, command, options);

        console.log(util.inspect(config, { depth: null }));
    });

program.parse(process.argv);

if (!program.args.length) program.help();
