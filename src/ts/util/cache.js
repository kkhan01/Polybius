"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = function (getter) {
    let cache = null;
    return function () {
        return cache || (cache = getter());
    };
};
//# sourceMappingURL=cache.js.map