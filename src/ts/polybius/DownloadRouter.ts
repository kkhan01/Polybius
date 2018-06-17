const pathLib = require("path-browserify");
import {separateFunctionName} from "../util/utils";
import {renderPrompt} from "./Prompt";
import {getRouters, setRouterOptions} from "./serialize";
import DownloadItem = chrome.downloads.DownloadItem;

export interface Path {
    
    readonly path: string;
    
    readonly filename: string;
    
    readonly extension: string;
    
    readonly fullFilename: string;
    
    append(path: Path): Path;
    
    append(path: string): Path;
    
    absolute(): Path;
    
    toString(): string;
    
}

export const Path = {
    
    of(path: string): Path {
        const {root, dir, base, name, ext} = pathLib.parse(path);
        
        return {
            path: path,
            fullFilename: base,
            filename: name,
            extension: ext,
            append: (newPath: Path | string) => Path.of(pathLib.resolve(path, newPath.toString())),
            absolute: () => Path.of(pathLib.resolve(path)),
            toString: () => path,
        };
    },
    
};

export interface DownloadAction {
    
    readonly path: Path;
    
    readonly conflictAction: "uniquify" | "overwrite" | "prompt"
    
}

export interface Test<T> {
    
    (download: T): boolean;
    
}

export interface DownloadRoute {
    
    (download: DownloadItem): DownloadAction;
    
}

interface OptionLessDownloadRouter {
    
    readonly test: Test<DownloadItem>;
    
    readonly route: DownloadRoute;
}

export interface DownloadRouter extends OptionLessDownloadRouter {
    
    readonly options: RouterOptions;
    
}


chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    console.log(downloadItem);
    
    const alertObj = (obj: any) => {
        console.log(obj);
        console.log(obj.length);
        // alert(JSON.stringify(obj, null, 2));
    };
    
    // alertObj(downloadItem);
    
    const select = ({path, conflictAction}: DownloadAction): void => {
        alertObj({path, conflictAction});
        const filename = path.toString().slice(1);
        console.log(filename);
        suggest({filename, conflictAction});
    };
    
    // console.log(getRouters());
    // alertObj(getRouters());
    
    const actions: DownloadAction[] = getRouters()
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
        suggest({filename: downloadItem.filename, conflictAction: "prompt"});
    }
    if (actions.length === 1) {
        // console.log("actions", actions);
        // console.log("selecting", actions[0]);
        select(actions[0]);
    }
    renderPrompt(actions, select);
});

interface TestRouterOptions<T> {
    
    readonly enabled: boolean;
    
    readonly test: Test<T>;
    
    readonly route: DownloadRoute;
    
}

export interface UnTypedRouterOptions {
    
    readonly enabled: boolean;
    
    readonly test: string;
    
    readonly route: Path;
    
}

interface TestDownloadRouterConstructor<T = string> {
    
    create: (options: TestRouterOptions<T>) => OptionLessDownloadRouter;
    
    map<U>(map: (t: T) => U): TestDownloadRouterConstructor<U>;
    
    wrap(type: DownloadRouterType, map: (input: string) => Test<T>): DownloadRouterConstructor;
    
}

interface DownloadRouterConstructor {
    
    type: DownloadRouterType;
    
    create: (options: UnTypedRouterOptions) => DownloadRouter;
    
    displayName: string;
    
}

type DownloadRouterConstructorMap = {[key: string]: DownloadRouterConstructor};

interface DownloadRouterConstructors extends DownloadRouterConstructorMap {
    
    download: DownloadRouterConstructor;
    
    path: DownloadRouterConstructor;
    
    filename: DownloadRouterConstructor;
    
    extension: DownloadRouterConstructor;
    
    fileSize: DownloadRouterConstructor;
    
    url: DownloadRouterConstructor;
    
    urlHref: DownloadRouterConstructor;
    
    urlProtocol: DownloadRouterConstructor;
    
    urlHost: DownloadRouterConstructor;
    
    urlPath: DownloadRouterConstructor;
    
    urlHash: DownloadRouterConstructor;
    
}

export type DownloadRouterType = keyof DownloadRouterConstructors;


export interface RouterOptions extends UnTypedRouterOptions {
    
    readonly type: DownloadRouterType;
    
}

export const DownloadRouter: DownloadRouterConstructors = ((): DownloadRouterConstructors => {
    
    const construct = <T>(create: (options: TestRouterOptions<T>) => OptionLessDownloadRouter): TestDownloadRouterConstructor<T> => {
        return {
            
            create,
            
            map: <U>(map: (t: T) => U): TestDownloadRouterConstructor<U> => {
                return construct(({enabled, test, route}: TestRouterOptions<U>) =>
                    create({enabled, test: (t: T) => {
                        const result = test(map(t));
                        // console.log(result, t, map, test);
                        return result;
                        }, route}));
            },
            
            wrap: (type: DownloadRouterType, map: (input: string) => Test<T>): DownloadRouterConstructor => {
                return {
                    
                    type,
                    
                    create: (options): DownloadRouter => {
                        console.log(options);
                        const {enabled, test, route} = options;
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
                                        const x = route.append(Path.of(download.filename).fullFilename);
                                        console.log(x);
                                        return x;
                                    })(),
                                    conflictAction: "uniquify",
                                }),
                            }),
                        };
                    },
                    
                    displayName: separateFunctionName(type as string),
                    
                };
            },
            
        };
    };
    
    const byEnabled: TestDownloadRouterConstructor<DownloadItem> = construct(
        ({enabled, test, route}: TestRouterOptions<DownloadItem>) => ({
            test: (download: DownloadItem) => enabled && test(download),
            route,
        })
    );
    
    const byPath = byEnabled.map(download => download.filename).map(Path.of);
    const byFilename = byPath.map(path => path.filename);
    const byExtension = byPath.map(path => path.extension.slice(1));
    const byFileSize = byEnabled.map(download => download.fileSize);
    const byUrl = byEnabled.map(download => new URL(download.url));
    const byUrlHref = byUrl.map(url => url.href);
    const byUrlProtocol = byUrl.map(url => url.protocol.slice(0, url.protocol.length - 1)); // strip trailing :
    const byUrlHost = byUrl.map(url => url.host);
    const byUrlPath = byUrl.map(url => url.pathname);
    const byUrlHash = byUrl.map(url => url.hash.slice(1));
    
    const stringTest = (input: string) => (s: string) => {
        console.log("stringTest", input, s);
        return input === s;
    };
    
    const numberTest = (input: string): Test<number> => {
        const _n: number = parseInt(input);
        return n => _n === n;
    };
    
    const parseFunction = <T>(functionBody: string): Test<T> => {
        return {} as any as Test<T>;
    };
    
    const functionTest = <T>(input: string) => parseFunction(input);
    
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

export const Routers: DownloadRouterConstructor[] = Object.values(DownloadRouter);

export const routerTypeNames: string[] = Routers.map(({displayName}) => displayName);

const regexTest = function(regex: RegExp): Test<string> {
    return s => regex.test(s);
};


export const f = function(): void {
    setRouterOptions([
        DownloadRouter.urlHash.create({
            enabled: true,
            test: "google",
            route: Path.of("google"),
        }),
        DownloadRouter.extension.create({
            enabled: true,
            test: "png",
            route: Path.of("pngs"),
        }),
        DownloadRouter.extension.create({
            enabled: true,
            test: "pdf",
            route: Path.of("pdfs"),
        }),
        DownloadRouter.filename.create({
            enabled: true,
            test: "logo",
            route: Path.of("logos"),
        }),
    ].map(router => router.options));
};