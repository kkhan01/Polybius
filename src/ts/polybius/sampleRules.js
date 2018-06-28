"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = require("./Route");
const Router_1 = require("./Router");
const Storage_1 = require("./Storage");
const Test_1 = require("./Test");
exports.addSampleRules = function () {
    (async () => {
        await Storage_1.storage.routers.set(await Promise.all([
            Router_1.Router.urlHref({
                enabled: true,
                test: Test_1.Test.regex({ input: RegExp.toSource(/^.*google.*$/i) }),
                route: Route_1.Route.path({ input: "google" }),
            }),
            Router_1.Router.filename({
                enabled: true,
                test: Test_1.Test.string({ input: "logo" }),
                route: Route_1.Route.path({ input: "logos" }),
            }),
            Router_1.Router.extension({
                enabled: true,
                test: Test_1.Test.string({ input: "png" }),
                route: Route_1.Route.path({ input: "png" }),
            }),
            Router_1.Router.extension({
                enabled: true,
                test: Test_1.Test.string({ input: "pdf" }),
                route: Route_1.Route.path({ input: "pdf" }),
            }),
            Router_1.Router.extension({
                enabled: true,
                test: Test_1.Test.string({ input: "js" }),
                route: Route_1.Route.path({ input: "js" }),
            }),
        ]));
    })();
};
//# sourceMappingURL=sampleRules.js.map