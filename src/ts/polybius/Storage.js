"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyWindow_1 = require("../util/anyWindow");
const StorageItem_1 = require("../util/storage/StorageItem");
const Router_1 = require("./Router");
exports.storage = (() => {
    const routerRules = StorageItem_1.StorageItem.newArray({ key: "routerRules" });
    const routers = routerRules.map({
        serialize: Router_1.serializeRouter,
        deserialize: Router_1.deserializeRouter,
    });
    return {
        routerRules,
        routers,
    };
})();
exports.storage.freeze();
anyWindow_1.globals({ storage: exports.storage });
//# sourceMappingURL=Storage.js.map