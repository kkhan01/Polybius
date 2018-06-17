"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouterOptions = (() => {
    let options = null;
    return function () {
    };
})();
exports.getRouters = (() => {
    let routes = null;
    return function () {
        return routes || (routes = JSON.parse(localStorage.routes));
    };
})();
//# sourceMappingURL=serialize.js.map