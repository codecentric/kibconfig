'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Mapper = function () {
    function Mapper() {
        (0, _classCallCheck3.default)(this, Mapper);
    }

    (0, _createClass3.default)(Mapper, null, [{
        key: 'mapToLocal',
        value: function mapToLocal(entry) {
            var source = entry._source;
            var target = (0, _assign2.default)({ id: entry._id }, JSON.parse((0, _stringify2.default)(source)));

            if (target.visState) {
                target.visState = Mapper.sortByKey(JSON.parse(target.visState));
            }
            Mapper.replaceJsonWithJs(target);
            if (target.kibanaSavedObjectMeta) {
                Mapper.replaceJsonWithJs(target.kibanaSavedObjectMeta);
            }
            return target;
        }
    }, {
        key: 'mapToRemote',
        value: function mapToRemote(content) {
            var target = JSON.parse((0, _stringify2.default)(content));

            delete target.id;
            if (target.visState) {
                target.visState = (0, _stringify2.default)(target.visState);
            }
            Mapper.replaceJsWithJson(target);
            if (target.kibanaSavedObjectMeta) {
                Mapper.replaceJsWithJson(target.kibanaSavedObjectMeta);
            }
            return target;
        }
    }, {
        key: 'replaceJsonWithJs',
        value: function replaceJsonWithJs(target) {
            (0, _keys2.default)(target).forEach(function (key) {
                if (key.endsWith('JSON')) {
                    target[key] = Mapper.sortByKey(JSON.parse(target[key])); // eslint-disable-line no-param-reassign
                }
            });
        }
    }, {
        key: 'replaceJsWithJson',
        value: function replaceJsWithJson(target) {
            (0, _keys2.default)(target).forEach(function (key) {
                if (key.endsWith('JSON')) {
                    target[key] = (0, _stringify2.default)(target[key]); // eslint-disable-line no-param-reassign
                }
            });
        }
    }, {
        key: 'sortByKey',
        value: function sortByKey(unordered) {
            if (unordered instanceof Array) {
                return unordered.map(function (entry) {
                    return Mapper.sortByKey(entry);
                });
            } else if ((typeof unordered === 'undefined' ? 'undefined' : (0, _typeof3.default)(unordered)) === 'object') {
                var _ret = function () {
                    var ordered = {};

                    (0, _keys2.default)(unordered).sort().forEach(function (key) {
                        ordered[key] = Mapper.sortByKey(unordered[key]);
                    });
                    return {
                        v: ordered
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
            }
            return unordered;
        }
    }]);
    return Mapper;
}();

exports.default = Mapper;
module.exports = exports['default'];