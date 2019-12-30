"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _raf = _interopRequireDefault(require("raf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var MODE_TIMEOUT = 0;
var MODE_INTERVAL = 1;
var fnStacks = new Map();
var runArray = new Set();
var rafStarted = false;
var startId = 0;

function getTimeStamp() {
  return new Date().getTime();
}

function executeFn(value) {
  var fn = value.fn,
      args = value.args;
  fn.apply(void 0, _toConsumableArray(args));
}

function runFunction() {
  if (runArray.size === 0) return;
  runArray.forEach(executeFn);
  runArray.clear();
}

var checkTick = function checkTick(currentTimeTick) {
  return function (value, id) {
    var nextTick = value.nextTick,
        ms = value.ms,
        mode = value.mode;

    if (currentTimeTick - nextTick >= 0) {
      runArray.add(value);

      if (mode === MODE_TIMEOUT) {
        fnStacks.delete(id);
      } else {
        fnStacks.set(id, _objectSpread({}, value, {
          nextTick: nextTick + ms
        }));
      }
    }
  };
};

function loop() {
  var currentTimeTick = getTimeStamp();
  fnStacks.forEach(checkTick(currentTimeTick));
  runFunction();

  if (fnStacks.size === 0) {
    rafStarted = false;
    return;
  }

  (0, _raf.default)(loop);
}

function addId(_ref) {
  var fn = _ref.fn,
      _ref$ms = _ref.ms,
      ms = _ref$ms === void 0 ? 0 : _ref$ms,
      args = _ref.args,
      mode = _ref.mode;
  if (!fn) return null;
  var currentId = startId;
  fnStacks.set(currentId, {
    fn: fn,
    ms: ms,
    nextTick: getTimeStamp() + ms,
    args: args,
    mode: mode
  });

  if (!rafStarted) {
    rafStarted = true;
    (0, _raf.default)(loop);
  }

  startId += 1;
  return currentId;
}

function removeId(id) {
  if (fnStacks.has(id)) {
    fnStacks.delete(id);
  }

  if (fnStacks.size === 0) {
    rafStarted = false;
  }
}

var _default = {
  setTimeout: function setTimeout(fn) {
    var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return addId({
      fn: fn,
      ms: ms,
      args: args,
      mode: MODE_TIMEOUT
    });
  },
  clearTimeout: removeId,
  setInterval: function setInterval(fn) {
    var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    return addId({
      fn: fn,
      ms: ms,
      args: args,
      mode: MODE_INTERVAL
    });
  },
  clearInterval: removeId
};
exports.default = _default;