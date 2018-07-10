"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = require("./Storage");
exports.setRouters = async function (routers) {
    return await Storage_1.storage.routers.set(await Promise.all(routers));
};
exports.addRouters = async function (routers) {
    return await Storage_1.storage.routers.set((await Promise.all([Storage_1.storage.routers.get(), Promise.all(routers)])).flatMap(e => e));
};
//# sourceMappingURL=routers.js.map