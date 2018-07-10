"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chrome_promise_1 = require("chrome-promise");
const anyWindow_1 = require("../anyWindow");
const Callables_1 = require("../Callables");
const allExtensions_1 = require("../extensions/allExtensions");
const addRefreshers = function (storage) {
    return {
        ...storage,
        refreshers: Callables_1.Callables.new(),
    };
};
const browserStorageImpl = function (storage) {
    // noinspection CommaExpressionJS
    return addRefreshers({
        get: async (key) => storage[key],
        set: async (key, value) => (storage[key] = value, undefined),
    });
};
const chromeStorageImpl = function (storage) {
    return addRefreshers({
        get: async (key) => (await storage.get([key]))[key],
        set: async (key, value) => await storage.set({ [key]: value }),
    });
};
exports.storages = {
    browser: {
        local: browserStorageImpl(localStorage),
        session: browserStorageImpl(sessionStorage),
    },
    chrome: chrome_promise_1.default.storage ? {
        local: chromeStorageImpl(chrome_promise_1.default.storage.local),
        sync: chromeStorageImpl(chrome_promise_1.default.storage.sync),
    } : {
        local: browserStorageImpl(localStorage),
        sync: browserStorageImpl(localStorage),
    },
};
allExtensions_1.addExtensions();
exports.storages.freezeFields().freeze();
anyWindow_1.globals({ storages: exports.storages });
chrome.storage && chrome.storage.onChanged.addListener((changes, areaName) => {
    exports.storages.chrome.sync.refreshers.call(changes);
});
//# sourceMappingURL=Storages.js.map