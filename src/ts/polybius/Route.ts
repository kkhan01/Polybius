import {Path} from "../util/Path";
import {sandbox} from "../util/sandbox/SandboxMessenger";
import DownloadItem = chrome.downloads.DownloadItem;

type ConflictAction = "uniquify" | "overwrite" | "prompt";

const defaultConflictAction: ConflictAction = "uniquify";

export interface DownloadAction {
    readonly path: Path;
    readonly conflictAction: ConflictAction;
}

interface UnTypedRouteRule {
    readonly input: string;
    readonly conflictAction?: ConflictAction;
}

export interface RouteRule extends UnTypedRouteRule {
    readonly type: RouteType;
}

export interface RouteFunc {
    (download: DownloadItem): Promise<DownloadAction>;
}

export interface Route {
    readonly rule: RouteRule;
    readonly route: RouteFunc;
}

interface RouteConstructor {
    (rule: UnTypedRouteRule): Promise<Route>;
}

type RouteConstructorMap = {[key: string]: RouteConstructor};

interface RouteConstructors extends RouteConstructorMap {
    readonly path: RouteConstructor;
    readonly function: RouteConstructor;
}

type RouteType = keyof RouteConstructors;

export const Route: RouteConstructors = {
    
    path: async rule => {
        const {input, conflictAction = defaultConflictAction} = rule;
        const path = Path.of(input);
        return {
            rule: {
                type: "path",
                ...rule,
            },
            route: async download => ({
                path: path.append(Path.of(download.filename)),
                conflictAction,
            }),
        };
    },
    
    function: async rule => {
        const {input, conflictAction: backupConflictAction = defaultConflictAction} = rule;
        const func: RouteFunc = await (await sandbox).compile<DownloadAction>(input);
        return {
            rule: {
                type: "function",
                ...rule,
            },
            route: async download => {
                const {path, conflictAction = backupConflictAction} = await func(download);
                return {path, conflictAction};
            },
        };
    },
    
};

export const deserializeRoute = (rule: RouteRule) => Route[rule.type](rule);