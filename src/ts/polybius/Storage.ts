import {globals} from "../util/anyWindow";
import {StorageItem, StorageItems, StorageMap} from "../util/storage/StorageItem";
import {deserializeRouter, Router, serializeRouter} from "./Router";
import {RouterRule} from "./RouterRule";

export interface Storage extends StorageMap {
    
    readonly routerRules: StorageItems<RouterRule>;
    
    readonly routers: StorageItems<Router>;
    
}

export type StorageKey = keyof Storage;

export const storage: Storage = ((): Storage => {
    
    const routerRules = StorageItem.newArray<RouterRule>({key: "routerRules"});
    
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