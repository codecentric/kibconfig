'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fsPromise = require('fs-promise');

var fsp = _interopRequireWildcard(_fsPromise);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataDirectory = function () {
    function DataDirectory(config) {
        (0, _classCallCheck3.default)(this, DataDirectory);

        this.datadir = config.datadir;
        this.verbose = config.verbose;
    }

    (0, _createClass3.default)(DataDirectory, [{
        key: 'findAll',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                var updatedSearches, updatedVisualizations, updatedDashboards;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.findElementsOfType('search');

                            case 2:
                                updatedSearches = _context.sent;
                                _context.next = 5;
                                return this.findElementsOfType('visualization');

                            case 5:
                                updatedVisualizations = _context.sent;
                                _context.next = 8;
                                return this.findElementsOfType('dashboard');

                            case 8:
                                updatedDashboards = _context.sent;
                                return _context.abrupt('return', [].concat((0, _toConsumableArray3.default)(updatedSearches), (0, _toConsumableArray3.default)(updatedVisualizations), (0, _toConsumableArray3.default)(updatedDashboards)));

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function findAll() {
                return ref.apply(this, arguments);
            }

            return findAll;
        }()
    }, {
        key: 'store',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(type, id, jsonContent) {
                var content, typedir, name, filename;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                content = (0, _stringify2.default)(jsonContent, null, 4);
                                typedir = this.datadir + '/' + type;
                                name = DataDirectory.idToFilename(id);
                                filename = typedir + '/' + name + '.json';


                                if (this.verbose) {
                                    console.log('Updating ' + filename);
                                }

                                _context2.next = 7;
                                return this.mkdirIfMissing(this.datadir);

                            case 7:
                                _context2.next = 9;
                                return this.mkdirIfMissing(typedir);

                            case 9:
                                _context2.next = 11;
                                return fsp.writeFile(filename, content, 'utf8');

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function store(_x, _x2, _x3) {
                return ref.apply(this, arguments);
            }

            return store;
        }()
    }, {
        key: 'mkdirIfMissing',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(path) {
                var exists;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return fsp.exists(path);

                            case 2:
                                exists = _context3.sent;

                                if (exists) {
                                    _context3.next = 6;
                                    break;
                                }

                                _context3.next = 6;
                                return fsp.mkdir(path);

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function mkdirIfMissing(_x4) {
                return ref.apply(this, arguments);
            }

            return mkdirIfMissing;
        }()
    }, {
        key: 'findElementsOfType',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(type) {
                var directory, exists, files;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                directory = this.datadir + '/' + type;
                                _context4.next = 3;
                                return fsp.exists(directory);

                            case 3:
                                exists = _context4.sent;

                                if (!exists) {
                                    _context4.next = 12;
                                    break;
                                }

                                _context4.next = 7;
                                return fsp.readdir(directory);

                            case 7:
                                _context4.t0 = function (name) {
                                    return name.endsWith('.json');
                                };

                                files = _context4.sent.filter(_context4.t0);
                                _context4.next = 11;
                                return _promise2.default.all(files.map(this.loadFile.bind(this, type)));

                            case 11:
                                return _context4.abrupt('return', _context4.sent);

                            case 12:
                                return _context4.abrupt('return', []);

                            case 13:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function findElementsOfType(_x5) {
                return ref.apply(this, arguments);
            }

            return findElementsOfType;
        }()
    }, {
        key: 'loadFile',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(type, name) {
                var text, content, id;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return fsp.readFile(this.datadir + '/' + type + '/' + name, 'utf8');

                            case 2:
                                text = _context5.sent;
                                content = JSON.parse(text);
                                id = content.id;
                                return _context5.abrupt('return', { id: id, type: type, content: content });

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function loadFile(_x6, _x7) {
                return ref.apply(this, arguments);
            }

            return loadFile;
        }()
    }], [{
        key: 'idToFilename',
        value: function idToFilename(id) {
            return id.replace('_', '_').replace('*', '_').replace('(', '_').replace(')', '_');
        }
    }]);
    return DataDirectory;
}();

exports.default = DataDirectory;
module.exports = exports['default'];