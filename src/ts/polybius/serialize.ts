import {Path} from "../util/Path";
import {Router, RouterType} from "./Router";
import {RouterRule} from "./RouterRule";


export interface SerializedRouterRule {
    
    readonly type: RouterType;
    
    readonly enabled: boolean;
    
    readonly test: string;
    
    readonly path: string;
    
}

export const serializeRouterRule = function({type, enabled, test, route: {path}}: RouterRule): SerializedRouterRule {
    return {type, enabled, test, path};
};

export const deserializeRouterRule = function({type, enabled, test, path}: SerializedRouterRule): RouterRule {
    return {type, enabled, test, route: Path.of(path)};
};

export const serializeRouter = function(router: Router): RouterRule {
    return router.rule;
};

export const deserializeRouter = function(rule: RouterRule): Router {
    return Router[rule.type].create(rule);
};

// (async () => {
//     const x = await chromep.storage.sync.get(routerRulesKey);
// })();