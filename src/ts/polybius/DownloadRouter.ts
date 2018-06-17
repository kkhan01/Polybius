import {renderPrompt} from "./Prompt";
import {getRouters} from "./serialize";
import DownloadItem = chrome.downloads.DownloadItem;

export interface Path {
    
    readonly filename: string;
    
    readonly extension: string;
    
    absolute(): Path;
    
    toString(): string;
    
}

export const Path = {
    of(path: string): Path {
        return "" as any as Path;
    }
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

export interface DownloadRouter {
    
    test: Test<DownloadItem>;
    
    readonly route: DownloadRoute;
    
}


chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    const router = getRouters()
        .find(router => router.test(downloadItem));
    if (router) {
        const {path, conflictAction} = router.route(downloadItem);
        suggest({filename: path.toString(), conflictAction});
    }
    
    const select = ({path, conflictAction}: DownloadAction): void => {
        suggest({filename: path.toString(), conflictAction});
    };
    
    const actions: DownloadAction[] = getRouters()
        .filter(router => router.test(downloadItem))
        .map(router => router.route(downloadItem));
    
    if (actions.length === 0) {
        suggest({filename: downloadItem.filename, conflictAction: "prompt"});
    } else if (actions.length === 1) {
        select(actions[0]);
    }
    renderPrompt(actions, select);
});

interface RouterOptions<T> {
    
    readonly enabled: boolean;
    
    readonly test: Test<T>;
    
    readonly route: DownloadRoute;
    
}

interface DownloadRouterConstructor<T = string> {
    
    (options: RouterOptions<T>): DownloadRouter;
    
    map<U>(map: (t: T) => U): DownloadRouterConstructor<U>;
    
}

type DownloadRouterConstructorMap = {[key: string]: DownloadRouterConstructor<any>};

interface DownloadRouterConstructors extends DownloadRouterConstructorMap {
    
    download: DownloadRouterConstructor<DownloadItem>;
    
    path: DownloadRouterConstructor<Path>;
    
    filename: DownloadRouterConstructor;
    
    extension: DownloadRouterConstructor;
    
    fileSize: DownloadRouterConstructor<number>;
    
    url: DownloadRouterConstructor<URL>;
    
    urlHref: DownloadRouterConstructor;
    
    urlProtocol: DownloadRouterConstructor;
    
    urlHost: DownloadRouterConstructor;
    
    urlPath: DownloadRouterConstructor;
    
    urlHash: DownloadRouterConstructor;
    
}

export type DownloadRouterType = keyof DownloadRouterConstructors;

const DownloadRouter: DownloadRouterConstructors = ((): DownloadRouterConstructors => {
    
    const construct = <T>(plainConstructor: (options: RouterOptions<T>) => DownloadRouter): DownloadRouterConstructor<T> => {
        const constructor = plainConstructor as DownloadRouterConstructor<T>;
        constructor.map = <U>(map: (t: T) => U): DownloadRouterConstructor<U> => {
            return construct(({enabled, test, route}: RouterOptions<U>) =>
                constructor({enabled, test: (t: T) => test(map(t)), route}));
        };
        return constructor;
    };
    
    const byEnabled: DownloadRouterConstructor<DownloadItem> = construct(
        ({enabled, test, route}: RouterOptions<DownloadItem>) => ({
            test: (download: DownloadItem) => enabled && test(download),
            route,
        })
    );
    
    const byPath = byEnabled.map(download => download.filename).map(Path.of);
    const byFilename = byPath.map(path => path.filename);
    const byExtension = byPath.map(path => path.extension);
    const byFileSize = byEnabled.map(download => download.fileSize);
    const byUrl = byEnabled.map(download => new URL(download.url));
    const byUrlHref = byUrl.map(url => url.href);
    const byUrlProtocol = byUrl.map(url => url.protocol.slice(0, url.protocol.length - 1)); // strip trailing :
    const byUrlHost = byUrl.map(url => url.host);
    const byUrlPath = byUrl.map(url => url.pathname);
    const byUrlHash = byUrl.map(url => url.hash.slice(1));
    
    return {
        download: byEnabled,
        path: byPath,
        filename: byFilename,
        extension: byExtension,
        fileSize: byFileSize,
        url: byUrl,
        urlHref: byUrlHref,
        urlProtocol: byUrlProtocol,
        urlHost: byUrlHost,
        urlPath: byUrlPath,
        urlHash: byUrlHash,
    };
    
})();

// const _DownloadRouter: StringDownloadRouterConstructors = (() => {
//
// })();

const regexTest = function(regex: RegExp): Test<string> {
    return s => regex.test(s);
};


export const f = function(): void {
    const router = DownloadRouter.url.map(url => url.hash)({
        enabled: true,
        test: /google/.boundTest(),
        route: download => ({
            path: Path.of(""),
            conflictAction: "overwrite",
        }),
    });
    
    console.log(router);
};