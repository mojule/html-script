'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fromJsonML = function fromJsonML(jsonML, h) {
  var mapArg = function mapArg(arg) {
    if (Array.isArray(arg)) return fromArr(arg);

    return arg;
  };

  var fromArr = function fromArr(arr) {
    var head = arr[0];
    var args = arr.slice(1).map(mapArg);

    if (head in h) return h[head].apply(h, _toConsumableArray(args));

    return h.element.apply(h, [head].concat(_toConsumableArray(args)));
  };

  return mapArg(jsonML);
};

module.exports = fromJsonML;