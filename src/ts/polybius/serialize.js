"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("../util/cache");
const DownloadRouter_1 = require("./DownloadRouter");
const getSavedRouterOptions = cache_1.cache(() => JSON.parse(localStorage.routerOptions));
exports.getRouterOptions = () => getSavedRouterOptions();
exports.getRouters = cache_1.cache(() => {
    return getSavedRouterOptions().map((options) => {
        return DownloadRouter_1.DownloadRouter[options.type](options);
    });
});
//# sourceMappingURL=serialize.js.map