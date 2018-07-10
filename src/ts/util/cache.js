"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = function (getter) {
    let cache = null;
    return function () {
        return cache || (cache = getter());
    };
};
exports.getter = function (t) {
    return () => t;
};
//# sourceMappingURL=cache.js.map