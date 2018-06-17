"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathLib = require("path-browserify");
const utils_1 = require("../util/utils");
const Prompt_1 = require("./Prompt");
const serialize_1 = require("./serialize");
exports.Path = {
    of(path) {
        const { root, dir, base, name, ext } = pathLib.parse(path);
        return {
            fullFilename: base,
            filename: name,
            extension: ext,
            append: (newPath) => exports.Path.of(pathLib.resolve(path, newPath.toString())),
            absolute: () => exports.Path.of(pathLib.resolve(path)),
            toString: () => path,
        };
    },
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
    const construct = (create) => {
        return {
            create,
            map: (map) => {
                return construct(({ enabled, test, route }) => create({ enabled, test: (t) => test(map(t)), route }));
            },
            wrap: (type, map) => {
                return {
                    type,
                    create: (options) => {
                        const { enabled, test, route } = options;
                        return {
                            options: {
                                ...options,
                                type: type,
                            },
                            ...create({
                                enabled,
                                test: map(test),
                                route: download => ({
                                    path: route.append(exports.Path.of(download.filename).fullFilename),
                                    conflictAction: "prompt",
                                }),
                            }),
                        };
                    },
                    displayName: utils_1.separateFunctionName(type),
                };
            },
        };
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
    const stringTest = (input) => (s) => input === s;
    const numberTest = (input) => {
        const _n = parseInt(input);
        return n => _n === n;
    };
    const parseFunction = (functionBody) => {
        return {};
    };
    const functionTest = (input) => parseFunction(input);
    return {
        download: byEnabled.wrap("download", functionTest),
        path: byPath.wrap("path", functionTest),
        filename: byFilename.wrap("filename", stringTest),
        extension: byExtension.wrap("extension", stringTest),
        fileSize: byFileSize.wrap("fileSize", numberTest),
        url: byUrl.wrap("url", functionTest),
        urlHref: byUrlHref.wrap("urlHref", stringTest),
        urlProtocol: byUrlProtocol.wrap("urlProtocol", stringTest),
        urlHost: byUrlHost.wrap("urlHost", stringTest),
        urlPath: byUrlPath.wrap("urlPath", stringTest),
        urlHash: byUrlHash.wrap("urlHash", stringTest),
    };
})();
exports.Routers = Object.values(exports.DownloadRouter);
exports.routerTypeNames = exports.Routers.map(({ displayName }) => displayName);
const regexTest = function (regex) {
    return s => regex.test(s);
};
exports.f = function () {
    serialize_1.setRouterOptions([
        exports.DownloadRouter.urlHash.create({
            enabled: true,
            test: "google",
            route: exports.Path.of("path"),
        }),
        exports.DownloadRouter.extension.create({
            enabled: true,
            test: "png",
            route: exports.Path.of("~/Desktop/pngs"),
        }),
        exports.DownloadRouter.extension.create({
            enabled: true,
            test: "pdf",
            route: exports.Path.of("~/Desktop/pdfs"),
        }),
        exports.DownloadRouter.filename.create({
            enabled: true,
            test: "logo",
            route: exports.Path.of("~/Desktop/logos"),
        }),
    ].map(router => router.options));
};
//# sourceMappingURL=DownloadRouter.js.map