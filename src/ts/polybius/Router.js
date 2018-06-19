"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../util/Path");
const utils_1 = require("../util/utils");
exports.Router = (() => {
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
                            rule: {
                                ...options,
                                type: type,
                            },
                            ...create({
                                enabled,
                                test: map(test),
                                route: download => ({
                                    path: route.append(Path_1.Path.of(download.filename).fullFilename),
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
    const byDownload = construct(({ enabled, test, route }) => ({
        test: (download) => enabled && test(download),
        route,
    }));
    const byPath = byDownload.map(download => download.filename).map(Path_1.Path.of);
    const byFilename = byPath.map(path => path.filename);
    const byExtension = byPath.map(path => path.extension);
    const byUrl = byDownload.map(download => new URL(download.url));
    const byUrlHref = byUrl.map(url => url.href);
    const byUrlProtocol = byUrl.map(url => url.protocol.slice(0, url.protocol.length - 1)); // strip trailing :
    const byUrlHost = byUrl.map(url => url.host);
    const byUrlPath = byUrl.map(url => url.pathname);
    const byUrlHash = byUrl.map(url => url.hash.slice(1));
    const byReferrer = byDownload.map(download => download.referrer);
    const byMimeType = byDownload.map(download => download.mime);
    const byFileSize = byDownload.map(download => download.fileSize);
    const stringTest = (input) => {
        // test if regex
        const regex = utils_1.parseRegExpLiteral(input);
        if (regex) {
            return regex.boundTest();
        }
        else {
            return s => input === s;
        }
    };
    const numberTest = (input) => {
        const _n = parseInt(input);
        return n => _n === n;
    };
    const parseFunction = (functionBody) => {
        // TODO
        return {};
    };
    const functionTest = (input) => parseFunction(input);
    return {
        download: byDownload.wrap("download", functionTest),
        path: byPath.wrap("path", functionTest),
        filename: byFilename.wrap("filename", stringTest),
        extension: byExtension.wrap("extension", stringTest),
        url: byUrl.wrap("url", functionTest),
        urlHref: byUrlHref.wrap("urlHref", stringTest),
        urlProtocol: byUrlProtocol.wrap("urlProtocol", stringTest),
        urlHost: byUrlHost.wrap("urlHost", stringTest),
        urlPath: byUrlPath.wrap("urlPath", stringTest),
        urlHash: byUrlHash.wrap("urlHash", stringTest),
        referrer: byReferrer.wrap("referrer", stringTest),
        mimeType: byMimeType.wrap("mimeType", stringTest),
        fileSize: byFileSize.wrap("fileSize", numberTest),
    };
})();
exports.Routers = Object.values(exports.Router);
exports.routerTypeNames = exports.Routers.map(({ displayName }) => displayName);
//# sourceMappingURL=Router.js.map