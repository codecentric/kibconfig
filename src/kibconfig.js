import program from 'commander';
import PullCommand from './commands/PullCommand';

PullCommand.register(program);

program.parse(process.argv);

if (!program.args.length) program.help();
