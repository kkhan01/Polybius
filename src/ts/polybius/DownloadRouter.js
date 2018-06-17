"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_1 = require("./serialize");
exports.Path = {
    of(path) {
        return "";
    }
};
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    const router = serialize_1.getRouters()
        .find(router => router.test(downloadItem));
    if (router) {
        const { path, conflictAction } = router.route(downloadItem);
        suggest({ filename: path.toString(), conflictAction });
    }
    const actions = serialize_1.getRouters()
        .filter(router => router.test(downloadItem))
        .map(router => router.route(downloadItem));
});
const DownloadRouter = (() => {
    const construct = (plainConstructor) => {
        const constructor = plainConstructor;
        constructor.map = (map) => {
            return construct(({ enabled, test, route }) => constructor({ enabled, test: (t) => test(map(t)), route }));
        };
        return constructor;
    };
    const byEnabled = construct(({ enabled, test, route }) => ({
        test: (download) => enabled && test(download),
        route,
    }));
    const byPath = byEnabled.map(download => download.filename).map(exports.Path.of);
    const byFilename = byPath.map(path => path.filename);
    const byExtension = byPath.map(path => path.extension);
    const byFileSize = byEnabled.map(download => download.fileSize);
    const byUrl = byEnabled.map(download => new URL(download.url));
    return {
        enabled: byEnabled,
        path: byPath,
        filename: byFilename,
        extension: byExtension,
        fileSize: byFileSize,
        url: byUrl,
    };
})();
const regexTest = function (regex) {
    return s => regex.test(s);
};
exports.f = function () {
    const router = DownloadRouter.url.map(url => url.hash)({
        enabled: true,
        test: /google/.boundTest(),
        route: download => ({
            path: exports.Path.of(""),
            conflictAction: "overwrite",
        }),
    });
    console.log(router);
};
//# sourceMappingURL=DownloadRouter.js.map