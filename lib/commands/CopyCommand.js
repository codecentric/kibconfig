'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CopyCommand = function () {
    function CopyCommand(config, dataDirectory, type, id, options) {
        (0, _classCallCheck3.default)(this, CopyCommand);

        this.config = config;
        this.dataDirectory = dataDirectory;
        this.type = type;
        this.id = id;
        this.replacements = options.replace || [];
        this.ignores = (options.ignore || '').split(',');
        this.deep = options.deep;
        this.dryRun = options.dryRun;
        console.log(options.replace);

        this.changedEntries = [];
    }

    (0, _createClass3.default)(CopyCommand, [{
        key: 'execute',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.dataDirectory.findAll();

                            case 2:
                                this.entries = _context.sent;


                                this.copy(this.type, this.id);

                                if (!this.dryRun) {
                                    _context.next = 8;
                                    break;
                                }

                                console.log(this.changedEntries);
                                _context.next = 10;
                                break;

                            case 8:
                                _context.next = 10;
                                return this.storeChanges();

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function execute() {
                return _ref.apply(this, arguments);
            }

            return execute;
        }()
    }, {
        key: 'copy',
        value: function copy(type, id) {
            var entry = this.entries.find(function (it) {
                return it.type === type && it.id === id;
            });
            if (this.ignores.indexOf(id) !== -1) {
                console.log(type + ' ' + id + ' ignored');
                return entry;
            }

            var newId = this.replaceId(id);

            if (!entry) {
                throw new Error(type + ' ' + id + ' not found');
            }
            if (newId === id) {
                throw new Error('Replacements \'' + (0, _stringify2.default)(this.replacements) + '\' do not match for id ' + id);
            }

            var existingNewEntry = this.entries.find(function (it) {
                return it.type === type && it.id === newId;
            });
            if (existingNewEntry) {
                console.log(type + ' ' + newId + ' already exists - skipping');
                return existingNewEntry;
            }
            var alreadyConvertedEntry = this.changedEntries.find(function (it) {
                return it.type === type && it.id === newId;
            });
            if (alreadyConvertedEntry) {
                console.log(type + ' ' + newId + ' was already converted - skipping');
                return alreadyConvertedEntry;
            }

            console.log('Copying ' + type + ' ' + id + ' to ' + newId);

            var newEntry = (0, _extends3.default)({}, entry, {
                id: newId,
                content: (0, _extends3.default)({}, entry.content, {
                    id: newId
                })
            });

            if (this.deep) {
                newEntry = this.replaceChildren(newEntry);
            }

            this.changedEntries.push(newEntry);
            return newEntry;
        }
    }, {
        key: 'replaceId',
        value: function replaceId(id) {
            var newId = id;
            this.replacements.forEach(function (replacement) {
                var _replacement$split = replacement.split(':'),
                    _replacement$split2 = (0, _slicedToArray3.default)(_replacement$split, 2),
                    before = _replacement$split2[0],
                    after = _replacement$split2[1];

                newId = newId.replace(new RegExp(before), after);
            });
            return newId;
        }
    }, {
        key: 'replaceChildren',
        value: function replaceChildren(entry) {
            switch (entry.type) {
                case 'dashboard':
                    return this.replaceChildrenOfDashboard(entry);
                case 'visualization':
                    return this.replaceChildrenOfVisualization(entry);
                default:
                    return entry;
            }
        }
    }, {
        key: 'replaceChildrenOfDashboard',
        value: function replaceChildrenOfDashboard(entry) {
            var _this = this;

            return (0, _extends3.default)({}, entry, {
                content: (0, _extends3.default)({}, entry.content, {
                    panelsJSON: entry.content.panelsJSON.map(function (panel) {
                        var changedEntry = _this.copy(panel.type, panel.id);

                        return (0, _extends3.default)({}, panel, {
                            id: changedEntry.id
                        });
                    })
                })
            });
        }
    }, {
        key: 'replaceChildrenOfVisualization',
        value: function replaceChildrenOfVisualization(entry) {
            var searchId = entry.content.savedSearchId;
            if (searchId) {
                var changedEntry = this.copy('search', searchId);

                return (0, _extends3.default)({}, entry, {
                    content: (0, _extends3.default)({}, entry.content, {
                        savedSearchId: changedEntry.id
                    })
                });
            }
            return entry;
        }
    }, {
        key: 'storeChanges',
        value: function storeChanges() {
            var _this2 = this;

            return _promise2.default.all(this.changedEntries.map(function (entry) {
                return _this2.dataDirectory.store(entry.type, entry.id, entry.content).then(function () {
                    return console.log('Wrote ' + entry.type + ' ' + entry.id + ' to data directory');
                });
            }));
        }
    }]);
    return CopyCommand;
}();

exports.default = CopyCommand;
module.exports = exports['default'];