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

interface TestRouterOptions<T> {
    
    readonly enabled: boolean;
    
    readonly test: Test<T>;
    
    readonly route: DownloadRoute;
    
}

export interface RouterOptions {
    
    readonly enabled: boolean;
    
    readonly test: string;
    
    readonly route: DownloadRoute;
    
}

interface TestDownloadRouterConstructor<T = string> {
    
    (options: TestRouterOptions<T>): DownloadRouter;
    
    map<U>(map: (t: T) => U): TestDownloadRouterConstructor<U>;
    
    wrap(map: (input: string) => Test<T>): DownloadRouterConstructor;
    
}

interface DownloadRouterConstructor {
    
    (options: RouterOptions): DownloadRouter;
    
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


export interface SavedRouterOptions extends RouterOptions {
    
    readonly type: DownloadRouterType;
    
}

export const DownloadRouter: DownloadRouterConstructors = ((): DownloadRouterConstructors => {
    
    const construct = <T>(plainConstructor: (options: TestRouterOptions<T>) => DownloadRouter): TestDownloadRouterConstructor<T> => {
        const constructor = plainConstructor as TestDownloadRouterConstructor<T>;
        constructor.map = <U>(map: (t: T) => U): TestDownloadRouterConstructor<U> => {
            return construct(({enabled, test, route}: TestRouterOptions<U>) =>
                constructor({enabled, test: (t: T) => test(map(t)), route}));
        };
        constructor.wrap = (map: (input: string) => Test<T>): DownloadRouterConstructor => {
            return ({enabled, test, route}) =>
                constructor({enabled, test: map(test), route});
        };
        return constructor;
    };
    
    const byEnabled: TestDownloadRouterConstructor<DownloadItem> = construct(
        ({enabled, test, route}: TestRouterOptions<DownloadItem>) => ({
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
    
    const inputStringMap = (input: string) => (s: string) => input === s;
    
    const parseFunction = <T>(functionBody: string): Test<T> => {
        return {} as any as Test<T>;
    };
    
    const numberFunctionMap = (input: string): Test<number> => {
        const _n: number = parseInt(input);
        return n => _n === n;
    };
    
    const inputFunctionMap = <T>(input: string) => parseFunction(input);
    
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

const regexTest = function(regex: RegExp): Test<string> {
    return s => regex.test(s);
};


export const f = function(): void {
    const router = DownloadRouter.urlHash({
        enabled: true,
        test: "google",
        route: download => ({
            path: Path.of(""),
            conflictAction: "overwrite",
        }),
    });
    
    console.log(router);
};