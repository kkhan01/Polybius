"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../util/Path");
const Router_1 = require("./Router");
const polybiusKey = "Polybius";
const routerRulesKey = "routerRules";
exports.serializeRouterRule = function ({ type, enabled, test, route: { path } }) {
    return { type, enabled, test, path };
};
exports.deserializeRouterRule = function ({ type, enabled, test, path }) {
    return { type, enabled, test, route: Path_1.Path.of(path) };
};
exports.serializeRouter = function (router) {
    return router.rule;
};
exports.deserializeRouter = function (rule) {
    return Router_1.Router[rule.type].create(rule);
};
// (async () => {
//     const x = await chromep.storage.sync.get(routerRulesKey);
// })();
//# sourceMappingURL=serialize.js.map