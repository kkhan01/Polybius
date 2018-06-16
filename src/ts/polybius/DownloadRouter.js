"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = {
    of(path) {
        return "";
    }
};
const getRouters = (function () {
    let routes = null;
    return function () {
        return routes || (routes = JSON.parse(localStorage.routes));
    };
})();
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    const router = getRouters()
        .find(router => router.test(downloadItem));
    if (router) {
        const { path, conflictAction } = router.route(downloadItem);
        suggest({ filename: path.toString(), conflictAction });
    }
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
        byEnabled,
        byPath,
        byFilename,
        byExtension,
        byFileSize,
        byUrl,
    };
})();
const regexTest = function (regex) {
    return s => regex.test(s);
};
DownloadRouter.byUrl.map(url => url.origin)({
    enabled: true,
    test: /google/.boundTest(),
    route: download => ({
        path: exports.Path.of(""),
        conflictAction: "overwrite",
    }),
});
//# sourceMappingURL=DownloadRouter.js.map