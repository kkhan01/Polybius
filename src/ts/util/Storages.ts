import {addExtensions} from "./extensions/allExtensions";
import {BrowserStorage} from "./typeAliases";
import {StorageKey} from "../polybius/Storage";


export interface StorageImpl {
    
    readonly get: (key: StorageKey) => Promise<string | undefined>;
    
    readonly set: (key: StorageKey, value: string) => Promise<void>;
    
}

type StorageImplMap = {[key: string]: StorageImpl};

export interface Storages {
    
    readonly local: StorageImpl;
    
    readonly session: StorageImpl;
    
    readonly cloud: StorageImpl;
    
}

const browserStorageImpl = function(storage: BrowserStorage): StorageImpl {
    // noinspection CommaExpressionJS
    return {
        get: async key => storage[key],
        set: async (key, value) => (storage[key] = value, undefined),
    };
};

type StorageType = keyof Storages;

export const Storages: Storages = {
    
    local: browserStorageImpl(localStorage),
    
    session: browserStorageImpl(sessionStorage),
    
    // TODO
    cloud: {
        get: async key => localStorage[key],
        set: async (key, value) => (localStorage[key] = value, undefined),
    },
    
};

addExtensions();

Storages.freeze();