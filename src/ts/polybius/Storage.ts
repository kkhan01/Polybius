import {anyWindow, globals} from "../util/anyWindow";
import {StorageItem, StorageItems, StorageMap} from "../util/StorageItem";
import {Router} from "./Router";
import {RouterRule} from "./RouterRule";
import {
    deserializeRouter,
    deserializeRouterRule,
    SerializedRouterRule,
    serializeRouter,
    serializeRouterRule
} from "./serialize";

export interface Storage extends StorageMap {
    
    readonly routerRules: StorageItems<RouterRule>;
    
    readonly routers: StorageItems<Router>;
    
}

export type StorageKey = keyof Storage;

export const storage: Storage = ((): Storage => {
    
    const routerRules = StorageItem.newArray<RouterRule, SerializedRouterRule>({
        key: "routerRules",
        converter: {
            serialize: serializeRouterRule,
            deserialize: deserializeRouterRule,
        },
    });
    
    const routers = routerRules.map({
        serialize: serializeRouter,
        deserialize: deserializeRouter,
    });
    
    return {
        routerRules,
        routers,
    };
    
})();

storage.freeze();

globals({storage});