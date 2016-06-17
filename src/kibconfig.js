import program from 'commander';

import PullCommand from './commands/PullCommand';

program
    .command('pull')
    .description('Pulls all config objects to a local ./data subfolder')
    .option('--url <url>', 'Kibana server URL', null, null)
    .action((command, options) => {
        new PullCommand(program, command, options).execute();
    });

program.parse(process.argv);

if (!program.args.length) program.help();
