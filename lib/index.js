'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var createTargetDirectory = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(targetDir) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _fsPromise2.default.exists(targetDir);

                    case 2:
                        if (_context.sent) {
                            _context.next = 5;
                            break;
                        }

                        _context.next = 5;
                        return _fsPromise2.default.mkdir(targetDir);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
    return function createTargetDirectory(_x) {
        return ref.apply(this, arguments);
    };
}();

var createDirectories = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(targetDir, entries) {
        var i, type, typeDir;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        i = 0;

                    case 1:
                        if (!(i < entries.length)) {
                            _context2.next = 13;
                            break;
                        }

                        type = entries[i]._type;
                        typeDir = targetDir + '/' + type;
                        _context2.next = 6;
                        return _fsPromise2.default.exists(typeDir);

                    case 6:
                        if (_context2.sent) {
                            _context2.next = 10;
                            break;
                        }

                        console.log('Creating directory ' + typeDir);
                        _context2.next = 10;
                        return _fsPromise2.default.mkdir(typeDir);

                    case 10:
                        i++;
                        _context2.next = 1;
                        break;

                    case 13:
                        return _context2.abrupt('return', entries);

                    case 14:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));
    return function createDirectories(_x2, _x3) {
        return ref.apply(this, arguments);
    };
}();

var storeEntry = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(targetDir, entry) {
        var filename, content;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!entry._type) {
                            _context3.next = 6;
                            break;
                        }

                        filename = targetDir + '/' + entry._type + '/' + idToFilename(entry._id) + '.json';
                        content = (0, _stringify2.default)(mapToLocal(entry._source), null, 4);


                        console.log('Updating ' + filename);
                        _context3.next = 6;
                        return _fsPromise2.default.writeFile(filename, content, 'utf8');

                    case 6:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));
    return function storeEntry(_x4, _x5) {
        return ref.apply(this, arguments);
    };
}();

var pull = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(command, options) {
        var baseUrl, targetDir, result, entries;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        baseUrl = options.url;
                        targetDir = './data';
                        _context4.prev = 2;
                        _context4.next = 5;
                        return createTargetDirectory(targetDir);

                    case 5:
                        _context4.next = 7;
                        return _promiseRequest2.default.get(baseUrl + '/.kibana/_search?size=1000&q=*').set('Accept', 'application/json').promise();

                    case 7:
                        result = _context4.sent;
                        entries = result.body.hits.hits;
                        _context4.next = 11;
                        return createDirectories(targetDir, entries);

                    case 11:
                        _context4.next = 13;
                        return _promise2.default.all(entries.map(storeEntry.bind(this, targetDir)));

                    case 13:
                        process.exit(0);
                        _context4.next = 20;
                        break;

                    case 16:
                        _context4.prev = 16;
                        _context4.t0 = _context4['catch'](2);

                        console.error(_context4.t0);
                        process.exit(1);

                    case 20:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this, [[2, 16]]);
    }));
    return function pull(_x6, _x7) {
        return ref.apply(this, arguments);
    };
}();

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _promiseRequest = require('./promiseRequest');

var _promiseRequest2 = _interopRequireDefault(_promiseRequest);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function idToFilename(id) {
    return id.replace('_', '_').replace('*', '_').replace('(', '_').replace(')', '_');
}

function mapToLocal(source) {
    var target = JSON.parse((0, _stringify2.default)(source));

    if (target.panelsJSON) {
        target.panelsJSON = JSON.parse(target.panelsJSON);
    }
    if (target.kibanaSavedObjectMeta && target.kibanaSavedObjectMeta.searchSourceJSON) {
        target.kibanaSavedObjectMeta.searchSourceJSON = JSON.parse(target.kibanaSavedObjectMeta.searchSourceJSON);
    }
    return target;
}

_commander2.default.command('pull').description('Pull ').option('--url <url>', 'Kibana server URL').action(pull);

_commander2.default.parse(process.argv);

if (!_commander2.default.args.length) _commander2.default.help();