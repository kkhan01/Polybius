"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyWindow_1 = require("../util/anyWindow");
const StorageItem_1 = require("../util/StorageItem");
const serialize_1 = require("./serialize");
exports.storage = (() => {
    const routerRules = StorageItem_1.StorageItem.newArray({
        key: "routerRules",
        converter: {
            serialize: serialize_1.serializeRouterRule,
            deserialize: serialize_1.deserializeRouterRule,
        },
    });
    const routers = routerRules.map({
        serialize: serialize_1.serializeRouter,
        deserialize: serialize_1.deserializeRouter,
    });
    return {
        routerRules,
        routers,
    };
})();
exports.storage.freeze();
anyWindow_1.globals({ storage: exports.storage });
//# sourceMappingURL=Storage.js.map