import chromep from "chrome-promise";
import {chromepApi} from "chrome-promise/chrome-promise";
import {StorageKey} from "../polybius/Storage";
import {addExtensions} from "./extensions/allExtensions";
import {BrowserStorage} from "./typeAliases";
import StorageArea = chromepApi.storage.StorageArea;


export interface StorageImpl {
    
    readonly get: (key: StorageKey) => Promise<string | undefined>;
    
    readonly set: (key: StorageKey, value: string) => Promise<void>;
    
}

export interface Storages {
    
    readonly browser: {
        readonly local: StorageImpl;
        readonly session: StorageImpl;
    };
    
    readonly chrome: {
        readonly local: StorageImpl;
        readonly sync: StorageImpl;
    };
    
}

const browserStorageImpl = function(storage: BrowserStorage): StorageImpl {
    // noinspection CommaExpressionJS
    return {
        get: async key => storage[key],
        set: async (key, value) => (storage[key] = value, undefined),
    };
};

const chromeStorageImpl = function(storage: StorageArea): StorageImpl {
    return {
        get: async key => (await storage.get([key]))[key],
        set: async (key, value) => await storage.set({[key]: value}),
    };
};

export const Storages: Storages = {
    
    browser: {
        local: browserStorageImpl(localStorage),
        session: browserStorageImpl(sessionStorage),
    },
    
    chrome: {
        local: chromeStorageImpl(chromep.storage.local),
        sync: chromeStorageImpl(chromep.storage.sync),
    },
    
};

addExtensions();

Storages.freezeFields().freeze();