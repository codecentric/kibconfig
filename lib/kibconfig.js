'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _KibanaClient = require('./lib/KibanaClient');

var _KibanaClient2 = _interopRequireDefault(_KibanaClient);

var _createConfig = require('./lib/createConfig');

var _createConfig2 = _interopRequireDefault(_createConfig);

var _DataDirectory = require('./lib/DataDirectory');

var _DataDirectory2 = _interopRequireDefault(_DataDirectory);

var _PullCommand = require('./commands/PullCommand');

var _PullCommand2 = _interopRequireDefault(_PullCommand);

var _PushCommand = require('./commands/PushCommand');

var _PushCommand2 = _interopRequireDefault(_PushCommand);

var _DeleteCommand = require('./commands/DeleteCommand');

var _DeleteCommand2 = _interopRequireDefault(_DeleteCommand);

var _CopyCommand = require('./commands/CopyCommand');

var _CopyCommand2 = _interopRequireDefault(_CopyCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function execute(command) {
    command.execute().then(function () {
        process.exit(0);
    }).catch(function (err) {
        console.error(err.stack || err);
        process.exit(1);
    });
}

function multiValueOption() {
    var list = [];
    var add = function add(val) {
        list.push(val);
        return list;
    };

    return add;
}
_commander2.default.option('--datadir <datadir>', 'Set data dir', null, './data').option('--url <url>', 'Kibana server URL', null, null).option('--query <query>', 'Search Query for entry IDs', null, '*').option('--verbose', 'Show more information', null).option('--delete', 'Delete remote entries matching the query which are not pushed', null);

_commander2.default.command('pull [profile]').description('Pulls all config objects to the local <datadir>').action(function (profile, options) {
    var config = (0, _createConfig2.default)(_commander2.default, profile, options);
    var client = new _KibanaClient2.default(config);
    var dataDirectory = new _DataDirectory2.default(config);
    var cmd = new _PullCommand2.default(config, client, dataDirectory);

    execute(cmd);
});

_commander2.default.command('push [profile]').description('Pushes all local config objects to the remote server').action(function (profile, options) {
    var config = (0, _createConfig2.default)(_commander2.default, profile, options);
    var client = new _KibanaClient2.default(config);
    var dataDirectory = new _DataDirectory2.default(config);
    var cmd = new _PushCommand2.default(config, client, dataDirectory);

    execute(cmd);
});

_commander2.default.command('delete [profile]').description('Deletes all config objects specified by query the remote server').action(function (profile, options) {
    var config = (0, _createConfig2.default)(_commander2.default, profile, options);
    var client = new _KibanaClient2.default(config);
    var cmd = new _DeleteCommand2.default(config, client);

    execute(cmd);
});

_commander2.default.command('copy <profile> <type> <id>').description('Copies the given exported file into a new location replacing it\'s ID').option('--deep', 'Deep copy', null).option('--replace <pattern>:<replacement>', 'Replacement', multiValueOption()).option('--ignore <id>,...', 'Ignored IDs', null).option('--dry-run', 'Dry run', null).action(function (profile, type, id, options) {
    var config = (0, _createConfig2.default)(_commander2.default, profile, options);
    var dataDirectory = new _DataDirectory2.default(config);
    var cmd = new _CopyCommand2.default(config, dataDirectory, type, id, options);

    execute(cmd);
});

_commander2.default.command('config [profile]').description('Displays the used configuration').action(function (profile, options) {
    var config = (0, _createConfig2.default)(_commander2.default, profile, options);

    console.log(_util2.default.inspect(config, { depth: null }));
});

_commander2.default.parse(process.argv);

if (!_commander2.default.args.length) _commander2.default.help();