import program from 'commander';
import PullCommand from './commands/PullCommand';
import PushCommand from './commands/PushCommand';

PullCommand.register(program);
PushCommand.register(program);

program
    .option('--datadir <datadir>', 'Set data dir', null, './data')
    .option('--url <url>', 'Kibana server URL', null, null)
    .option('--query <query>', 'Search Query for entry IDs', null, '*');

program.parse(process.argv);

if (!program.args.length) program.help();
