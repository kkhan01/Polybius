"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathLib = require("path-browserify");
const utils_1 = require("../util/utils");
const serialize_1 = require("./serialize");
exports.Path = {
    of(path) {
        const { root, dir, base, name, ext } = pathLib.parse(path);
        return {
            path: path,
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
    console.log(downloadItem);
    const alertObj = (obj) => {
        console.log(obj);
        console.log(obj.length);
        // alert(JSON.stringify(obj, null, 2));
    };
    // alertObj(downloadItem);
    const select = ({ path, conflictAction }) => {
        alertObj({ path, conflictAction });
        const filename = path.toString().slice(1);
        console.log(filename);
        suggest({ filename, conflictAction });
    };
    // console.log(getRouters());
    // alertObj(getRouters());
    const actions = serialize_1.getRouters()
        .filter(router => router.test(downloadItem))
        .map(router => router.route(downloadItem));
    console.log("actions", actions);
    // alertObj(actions);
    if (actions.length === 0) {
        // try {
        //     actions.push(getRouters()[1].route(downloadItem));
        // } catch (e) {
        //     console.log("error");
        //     console.error(e);
        // }
        // alertObj(actions);
        suggest({ filename: downloadItem.filename, conflictAction: "prompt" });
    }
    if (actions.length === 1) {
        // console.log("actions", actions);
        // console.log("selecting", actions[0]);
        select(actions[0]);
    }
    select(actions[0]);
    return;
    // renderPrompt(actions, select);
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
                        console.log(options);
                        const { enabled, test, route } = options;
                        const _options = {
                            ...options,
                            type: type,
                        };
                        console.log("_options", _options);
                        return {
                            options: {
                                ...options,
                                type: type,
                            },
                            ...create({
                                enabled,
                                test: map(test),
                                route: download => ({
                                    path: (() => {
                                        const x = route.append(exports.Path.of(download.filename).fullFilename);
                                        console.log(x);
                                        return x;
                                    })(),
                                    conflictAction: "uniquify",
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
    const byExtension = byPath.map(path => path.extension.slice(1));
    const byFileSize = byEnabled.map(download => download.fileSize);
    const byUrl = byEnabled.map(download => new URL(download.url));
    const byUrlHref = byUrl.map(url => url.href);
    const byUrlProtocol = byUrl.map(url => url.protocol.slice(0, url.protocol.length - 1)); // strip trailing :
    const byUrlHost = byUrl.map(url => url.host);
    const byUrlPath = byUrl.map(url => url.pathname);
    const byUrlHash = byUrl.map(url => url.hash.slice(1));
    const stringTest = (input) => (s) => {
        console.log("stringTest", input, s);
        return input === s;
    };
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
            route: exports.Path.of("google"),
        }),
        exports.DownloadRouter.filename.create({
            enabled: true,
            test: "logo",
            route: exports.Path.of("logos"),
        }),
        exports.DownloadRouter.extension.create({
            enabled: true,
            test: "png",
            route: exports.Path.of("pngs"),
        }),
        exports.DownloadRouter.extension.create({
            enabled: true,
            test: "pdf",
            route: exports.Path.of("pdfs"),
        }),
    ].map(router => router.options));
};
//# sourceMappingURL=DownloadRouter.js.map