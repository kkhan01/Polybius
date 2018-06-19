import {Test} from "../util/functional/Test";
import {Path} from "../util/Path";
import {parseRegExpLiteral, separateFunctionName} from "../util/utils";
import {DownloadRoute} from "./DownloadRoute";
import {RouterRule, UnTypedRouterRule} from "./RouterRule";
import DownloadItem = chrome.downloads.DownloadItem;

interface RuleLessRouter {
    
    readonly test: Test<DownloadItem>;
    
    readonly route: DownloadRoute;
}

export interface Router extends RuleLessRouter {
    
    readonly rule: RouterRule;
    
}

interface TestRouterRule<T> {
    
    readonly enabled: boolean;
    
    readonly test: Test<T>;
    
    readonly route: DownloadRoute;
    
}

interface TestDownloadRouterConstructor<T = string> {
    
    create: (options: TestRouterRule<T>) => RuleLessRouter;
    
    map<U>(map: (t: T) => U): TestDownloadRouterConstructor<U>;
    
    wrap(type: RouterType, map: (input: string) => Test<T>): RouterConstructor;
    
}

interface RouterConstructor {
    
    type: RouterType;
    
    create: (options: UnTypedRouterRule) => Router;
    
    displayName: string;
    
}

type RouterConstructorMap = {[key: string]: RouterConstructor};

interface RouterConstructors extends RouterConstructorMap {
    
    download: RouterConstructor;
    
    path: RouterConstructor;
    filename: RouterConstructor;
    extension: RouterConstructor;
    
    url: RouterConstructor;
    urlHref: RouterConstructor;
    urlProtocol: RouterConstructor;
    urlHost: RouterConstructor;
    urlPath: RouterConstructor;
    urlHash: RouterConstructor;
    
    referrer: RouterConstructor;
    mimeType: RouterConstructor;
    fileSize: RouterConstructor;
    
}

export type RouterType = keyof RouterConstructors;

export const Router: RouterConstructors = ((): RouterConstructors => {
    
    const construct = <T>(create: (options: TestRouterRule<T>) => RuleLessRouter): TestDownloadRouterConstructor<T> => {
        return {
            
            create,
            
            map: <U>(map: (t: T) => U): TestDownloadRouterConstructor<U> => {
                return construct(({enabled, test, route}: TestRouterRule<U>) =>
                    create({enabled, test: (t: T) => test(map(t)), route}));
            },
            
            wrap: (type: RouterType, map: (input: string) => Test<T>): RouterConstructor => {
                return {
                    
                    type,
                    
                    create: (options): Router => {
                        const {enabled, test, route} = options;
                        return {
                            rule: {
                                ...options,
                                type: type,
                            },
                            ...create({
                                enabled,
                                test: map(test),
                                route: download => ({
                                    path: route.append(Path.of(download.filename).fullFilename),
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
    
    const byDownload: TestDownloadRouterConstructor<DownloadItem> = construct(
        ({enabled, test, route}: TestRouterRule<DownloadItem>) => ({
            test: (download: DownloadItem) => enabled && test(download),
            route,
        })
    );
    
    const byPath = byDownload.map(download => download.filename).map(Path.of);
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
    
    const stringTest = (input: string): Test<string> => {
        // test if regex
        const regex = parseRegExpLiteral(input);
        if (regex) {
            return regex.boundTest();
        } else {
            return s => input === s;
        }
    };
    
    const numberTest = (input: string): Test<number> => {
        const _n: number = parseInt(input);
        return n => _n === n;
    };
    
    const parseFunction = <T>(functionBody: string): Test<T> => {
        // TODO
        return {} as any as Test<T>;
    };
    
    const functionTest = <T>(input: string) => parseFunction(input);
    
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

export const Routers: RouterConstructor[] = Object.values(Router);

export const routerTypeNames: string[] = Routers.map(({displayName}) => displayName);