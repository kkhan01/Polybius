import {AsyncTest} from "../util/functional/Test";
import {Path} from "../util/Path";
import {separateFunctionName} from "../util/utils";
import {deserializeRoute, RouteFunc} from "./Route";
import {RouterRule, UnTypedRouterRule} from "./RouterRule";
import {deserializeTest} from "./Test";
import DownloadItem = chrome.downloads.DownloadItem;

interface RuleLessRouter {
    
    readonly test: AsyncTest<DownloadItem>;
    
    readonly route: RouteFunc;
    
}

export interface Router extends RuleLessRouter {
    
    readonly rule: RouterRule;
    
}

interface TestRouterRule<T> {
    
    readonly enabled: boolean;
    
    readonly test: AsyncTest<T>;
    
    readonly route: RouteFunc;
    
}

interface TestRouterConstructor<T = string> {
    
    create: (rule: TestRouterRule<T>) => RuleLessRouter;
    
    map<U>(map: (t: T) => U): TestRouterConstructor<U>;
    
    typed(type: RouterType): RouterConstructor;
    
}

interface RouterFunc {
    
    (rule: UnTypedRouterRule): Promise<Router>;
    
}

interface RouterConstructor extends RouterFunc {
    
    type: RouterType;
    
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
    
    const construct = <T>(create: (rule: TestRouterRule<T>) => RuleLessRouter): TestRouterConstructor<T> => {
        return {
            
            create,
            
            map: <U>(map: (t: T) => U): TestRouterConstructor<U> => {
                return construct(({enabled, test, route}: TestRouterRule<U>) =>
                    create({enabled, test: (t: T) => test(map(t)), route}));
            },
            
            typed: (type: RouterType): RouterConstructor => {
                const f: RouterFunc = async rule => {
                    const {enabled, test, route} = rule;
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
                    displayName: separateFunctionName(type as string),
                });
            },
            
        };
    };
    
    const byDownload: TestRouterConstructor<DownloadItem> = construct(
        ({enabled, test, route}: TestRouterRule<DownloadItem>) => ({
            test: async (download: DownloadItem) => enabled && test(download),
            route,
        })
    );
    
    const byPath = byDownload.map(download => download.filename).map(Path.of);
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

export const Routers: RouterConstructor[] = Object.values(Router);

export const routerTypeNames: string[] = Routers.map(({displayName}) => displayName);

export const serializeRouter = (router: Router) => router.rule;

export const deserializeRouter = ({type, test, route, enabled}: RouterRule) => Router[type]({
    test: deserializeTest(test),
    route: deserializeRoute(route),
    enabled,
});
