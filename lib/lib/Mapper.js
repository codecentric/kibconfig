'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

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

            return Mapper.removeUndefined(Mapper.replaceJsonWithJs((0, _extends5.default)({}, source, {
                id: entry._id,
                visState: source.visState ? source.visState : undefined,
                kibanaSavedObjectMeta: Mapper.replaceJsonWithJs(source.kibanaSavedObjectMeta)
            })));
        }
    }, {
        key: 'mapToRemote',
        value: function mapToRemote(content) {
            return Mapper.removeUndefined(Mapper.replaceJsWithJson((0, _extends5.default)({}, content, {
                id: undefined,
                visState: (0, _stringify2.default)(content.visState),
                kibanaSavedObjectMeta: Mapper.replaceJsWithJson(content.kibanaSavedObjectMeta)
            })));
        }
    }, {
        key: 'replaceJsonWithJs',
        value: function replaceJsonWithJs(target) {
            return (0, _keys2.default)(target).reduce(function (converted, key) {
                return (0, _extends5.default)({}, converted, (0, _defineProperty3.default)({}, key, key.endsWith('JSON') ? JSON.parse(target[key]) : target[key]));
            }, {});
        }
    }, {
        key: 'replaceJsWithJson',
        value: function replaceJsWithJson(target) {
            return (0, _keys2.default)(target).reduce(function (converted, key) {
                return (0, _extends5.default)({}, converted, (0, _defineProperty3.default)({}, key, key.endsWith('JSON') ? (0, _stringify2.default)(target[key]) : target[key]));
            }, {});
        }
    }, {
        key: 'removeUndefined',
        value: function removeUndefined(obj) {
            return JSON.parse((0, _stringify2.default)(obj));
        }
    }]);
    return Mapper;
}();

exports.default = Mapper;
module.exports = exports['default'];