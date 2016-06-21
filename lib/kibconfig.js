'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _PullCommand = require('./commands/PullCommand');

var _PullCommand2 = _interopRequireDefault(_PullCommand);

var _PushCommand = require('./commands/PushCommand');

var _PushCommand2 = _interopRequireDefault(_PushCommand);

var _KibanaClient = require('./lib/KibanaClient');

var _KibanaClient2 = _interopRequireDefault(_KibanaClient);

var _createConfig = require('./lib/createConfig');

var _createConfig2 = _interopRequireDefault(_createConfig);

var _DataDirectory = require('./lib/DataDirectory');

var _DataDirectory2 = _interopRequireDefault(_DataDirectory);

var _util = require('util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function execute(command) {
    command.execute().then(function () {
        process.exit(0);
    }).catch(function (err) {
        console.error(err);
        process.exit(1);
    });
}

_commander2.default.option('--datadir <datadir>', 'Set data dir', null, './data').option('--url <url>', 'Kibana server URL', null, null).option('--query <query>', 'Search Query for entry IDs', null, '*').option('--verbose', 'Show more information', null).option('--delete', 'Delete remote entries matching the query which are not pushed', null);

_commander2.default.command('pull [profile]').description('Pulls all config objects to the local <datadir>').action(function (command, options) {
    var config = (0, _createConfig2.default)(_commander2.default, command, options);
    var client = new _KibanaClient2.default(config);
    var dataDirectory = new _DataDirectory2.default(config);
    var cmd = new _PullCommand2.default(config, client, dataDirectory);

    execute(cmd);
});

_commander2.default.command('push [profile]').description('Pushes all local config objects to the remote server').action(function (command, options) {
    var config = (0, _createConfig2.default)(_commander2.default, command, options);
    var client = new _KibanaClient2.default(config);
    var dataDirectory = new _DataDirectory2.default(config);
    var cmd = new _PushCommand2.default(config, client, dataDirectory);

    execute(cmd);
});

_commander2.default.command('config [profile]').description('Displays the used configuration').action(function (command, options) {
    var config = (0, _createConfig2.default)(_commander2.default, command, options);

    console.log(util.inspect(config, { depth: null }));
});

_commander2.default.parse(process.argv);

if (!_commander2.default.args.length) _commander2.default.help();