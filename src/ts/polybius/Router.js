"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../util/Path");
const utils_1 = require("../util/utils");
const Route_1 = require("./Route");
const Test_1 = require("./Test");
exports.Router = (() => {
    const construct = (create) => {
        return {
            create,
            map: (map) => {
                return construct(({ enabled, test, route }) => create({ enabled, test: (t) => test(map(t)), route }));
            },
            typed: (type) => {
                const f = async (rule) => {
                    const { enabled = true, test, route } = rule;
                    const [_test, _route] = await Promise.all([test, route]);
                    return {
                        rule: {
                            enabled,
                            test: _test.rule,
                            route: _route.rule,
                            type,
                        },
                        ...create({
                            enabled,
                            test: _test.test,
                            route: _route.route,
                        }),
                    };
                };
                return Object.assign(f, {
                    type,
                    displayName: utils_1.separateFunctionName(type),
                });
            },
        };
    };
    const byDownload = construct(({ enabled, test, route }) => ({
        test: async (download) => enabled && test(download),
        route,
    }));
    const byPath = byDownload.map(download => download.filename).map(Path_1.Path.of);
    const byFilename = byPath.map(path => path.filename);
    const byExtension = byPath.map(path => path.extension);
    const byUrl = byDownload.map(download => new URL(download.url));
    const byUrlHref = byUrl.map(url => url.href);
    const byUrlProtocol = byUrl.map(url => url.protocol.slice(0, -1)); // strip trailing ":"
    const byUrlHost = byUrl.map(url => url.host);
    const byUrlPath = byUrl.map(url => url.pathname);
    const byUrlHash = byUrl.map(url => url.hash.slice(1));
    const byReferrer = byDownload.map(download => download.referrer);
    const byMimeType = byDownload.map(download => download.mime);
    const byFileSize = byDownload.map(download => download.fileSize);
    return {
        download: byDownload.typed("download"),
        path: byPath.typed("path"),
        filename: byFilename.typed("filename"),
        extension: byExtension.typed("extension"),
        url: byUrl.typed("url"),
        urlHref: byUrlHref.typed("urlHref"),
        urlProtocol: byUrlProtocol.typed("urlProtocol"),
        urlHost: byUrlHost.typed("urlHost"),
        urlPath: byUrlPath.typed("urlPath"),
        urlHash: byUrlHash.typed("urlHash"),
        referrer: byReferrer.typed("referrer"),
        mimeType: byMimeType.typed("mimeType"),
        fileSize: byFileSize.typed("fileSize"),
    };
})();
exports.Routers = Object.values(exports.Router);
exports.routerTypeNames = exports.Routers.map(({ displayName }) => displayName);
exports.serializeRouter = (router) => router.rule;
exports.deserializeRouter = ({ type, test, route, enabled }) => exports.Router[type]({
    test: Test_1.deserializeTest(test),
    route: Route_1.deserializeRoute(route),
    enabled,
});
//# sourceMappingURL=Router.js.map