'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports._createConfig = _createConfig;
exports.default = createConfig;

var _findConfig = require('find-config');

var _findConfig2 = _interopRequireDefault(_findConfig);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configFile = (0, _findConfig2.default)('.kibconfig');
var configFromFile = configFile ? JSON.parse(_fs2.default.readFileSync(configFile, 'utf-8')) : { profiles: {} };

function coalesce() {
    var value = undefined;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(args), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var arg = _step.value;

            if (arg !== null && arg !== undefined) {
                value = arg;
                break;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return value;
}

function _createConfig(program, profileName, config) {
    var profile = profileName ? config.profiles[profileName] : {};

    if (!profile) {
        console.error('Unknown profile ' + profileName);
        process.exit(1);
    }

    var basedir = configFile ? _path2.default.dirname(configFile) : '.';
    var givenDatadir = coalesce(program.datadir, profile.datadir, config.datadir, 'data');
    var datadir = _path2.default.isAbsolute(givenDatadir) ? givenDatadir : _path2.default.join(basedir, givenDatadir);

    return {
        datadir: datadir,
        url: coalesce(program.url, profile.url, config.url),
        query: coalesce(program.query, profile.query, config.query, '*'),
        delete: coalesce(program.delete, profile.delete, config.delete, false),
        verbose: coalesce(program.verbose, profile.verbose, config.verbose, false)
    };
}

function createConfig(program, profileName) {
    return _createConfig(program, profileName, configFromFile);
}