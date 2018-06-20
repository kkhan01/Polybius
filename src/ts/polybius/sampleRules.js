"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../util/Path");
const Router_1 = require("./Router");
const Storage_1 = require("./Storage");
exports.addSampleRules = function () {
    // noinspection JSIgnoredPromiseFromCall
    Storage_1.storage.routers.set([
        Router_1.Router.urlHref.create({
            enabled: true,
            test: /^.*google.*$/i.toSource(),
            route: Path_1.Path.of("google"),
        }),
        Router_1.Router.filename.create({
            enabled: true,
            test: "logo",
            route: Path_1.Path.of("logos"),
        }),
        Router_1.Router.extension.create({
            enabled: true,
            test: "png",
            route: Path_1.Path.of("png"),
        }),
        Router_1.Router.extension.create({
            enabled: true,
            test: "pdf",
            route: Path_1.Path.of("pdf"),
        }),
    ]);
};
//# sourceMappingURL=sampleRules.js.map