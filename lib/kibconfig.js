'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _PullCommand = require('./commands/PullCommand');

var _PullCommand2 = _interopRequireDefault(_PullCommand);

var _PushCommand = require('./commands/PushCommand');

var _PushCommand2 = _interopRequireDefault(_PushCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_PullCommand2.default.register(_commander2.default);
_PushCommand2.default.register(_commander2.default);

_commander2.default.option('--datadir <datadir>', 'Set data dir', null, './data').option('--url <url>', 'Kibana server URL', null, null).option('--query <query>', 'Search Query for entry IDs', null, '*');

_commander2.default.parse(process.argv);

if (!_commander2.default.args.length) _commander2.default.help();