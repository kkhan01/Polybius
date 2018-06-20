"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chrome_promise_1 = require("chrome-promise");
const allExtensions_1 = require("./extensions/allExtensions");
const browserStorageImpl = function (storage) {
    // noinspection CommaExpressionJS
    return {
        get: async (key) => storage[key],
        set: async (key, value) => (storage[key] = value, undefined),
    };
};
const chromeStorageImpl = function (storage) {
    return {
        get: async (key) => (await storage.get([key]))[key],
        set: async (key, value) => await storage.set({ [key]: value }),
    };
};
exports.Storages = {
    browser: {
        local: browserStorageImpl(localStorage),
        session: browserStorageImpl(sessionStorage),
    },
    chrome: {
        local: chromeStorageImpl(chrome_promise_1.default.storage.local),
        sync: chromeStorageImpl(chrome_promise_1.default.storage.sync),
    },
};
allExtensions_1.addExtensions();
exports.Storages.freezeFields().freeze();
//# sourceMappingURL=Storages.js.map