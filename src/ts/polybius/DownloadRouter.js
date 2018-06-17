"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Prompt_1 = require("./Prompt");
const serialize_1 = require("./serialize");
exports.Path = {
    of(path) {
        return "";
    }
};
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    const select = ({ path, conflictAction }) => {
        suggest({ filename: path.toString(), conflictAction });
    };
    const actions = serialize_1.getRouters()
        .filter(router => router.test(downloadItem))
        .map(router => router.route(downloadItem));
    if (actions.length === 0) {
        suggest({ filename: downloadItem.filename, conflictAction: "prompt" });
    }
    else if (actions.length === 1) {
        select(actions[0]);
    }
    Prompt_1.renderPrompt(actions, select);
});
exports.DownloadRouter = (() => {
    const construct = (plainConstructor) => {
        const constructor = plainConstructor;
        constructor.map = (map) => {
            return construct(({ enabled, test, route }) => constructor({ enabled, test: (t) => test(map(t)), route }));
        };
        constructor.wrap = (map) => {
            return ({ enabled, test, route }) => constructor({ enabled, test: map(test), route });
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
    const byUrlHref = byUrl.map(url => url.href);
    const byUrlProtocol = byUrl.map(url => url.protocol.slice(0, url.protocol.length - 1)); // strip trailing :
    const byUrlHost = byUrl.map(url => url.host);
    const byUrlPath = byUrl.map(url => url.pathname);
    const byUrlHash = byUrl.map(url => url.hash.slice(1));
    const inputStringMap = (input) => (s) => input === s;
    const parseFunction = (functionBody) => {
        return {};
    };
    const numberFunctionMap = (input) => {
        const _n = parseInt(input);
        return n => _n === n;
    };
    const inputFunctionMap = (input) => parseFunction(input);
    return {
        download: byEnabled.wrap(inputFunctionMap),
        path: byPath.wrap(inputFunctionMap),
        filename: byFilename.wrap(inputStringMap),
        extension: byExtension.wrap(inputStringMap),
        fileSize: byFileSize.wrap(numberFunctionMap),
        url: byUrl.wrap(inputFunctionMap),
        urlHref: byUrlHref.wrap(inputStringMap),
        urlProtocol: byUrlProtocol.wrap(inputStringMap),
        urlHost: byUrlHost.wrap(inputStringMap),
        urlPath: byUrlPath.wrap(inputStringMap),
        urlHash: byUrlHash.wrap(inputStringMap),
    };
})();
// const _DownloadRouter: StringDownloadRouterConstructors = (() => {
//
// })();
const regexTest = function (regex) {
    return s => regex.test(s);
};
exports.f = function () {
    const router = exports.DownloadRouter.urlHash({
        enabled: true,
        test: "google",
        route: download => ({
            path: exports.Path.of(""),
            conflictAction: "overwrite",
        }),
    });
    console.log(router);
};
//# sourceMappingURL=DownloadRouter.js.map