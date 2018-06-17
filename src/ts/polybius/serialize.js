"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("../util/cache");
const DownloadRouter_1 = require("./DownloadRouter");
exports.getRouterOptions = cache_1.cache(() => JSON.parse(localStorage.routerOptions));
exports.getRouters = cache_1.cache(() => {
    return exports.getRouterOptions()
        .map(options => DownloadRouter_1.DownloadRouter[options.type].create(options));
});
exports.setRouterOptions = function (options) {
    localStorage.routerOptions = JSON.stringify(options);
};
//# sourceMappingURL=serialize.js.map