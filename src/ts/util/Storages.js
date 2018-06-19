"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allExtensions_1 = require("./extensions/allExtensions");
const browserStorageImpl = function (storage) {
    // noinspection CommaExpressionJS
    return {
        get: async (key) => storage[key],
        set: async (key, value) => (storage[key] = value, undefined),
    };
};
exports.Storages = {
    local: browserStorageImpl(localStorage),
    session: browserStorageImpl(sessionStorage),
    // TODO
    cloud: {
        get: async (key) => localStorage[key],
        set: async (key, value) => (localStorage[key] = value, undefined),
    },
};
allExtensions_1.addExtensions();
exports.Storages.freeze();
//# sourceMappingURL=Storages.js.map