import chromep from "chrome-promise";
import {chromepApi} from "chrome-promise/chrome-promise";
import {StorageKey} from "../polybius/Storage";
import {anyWindow, globals} from "./anyWindow";
import {Callables} from "./Callables";
import {addExtensions} from "./extensions/allExtensions";
import {BrowserStorage} from "./typeAliases";
import StorageChange = chrome.storage.StorageChange;
import StorageArea = chromepApi.storage.StorageArea;

interface NonRefreshableStorageImpl {
    
    readonly get: (key: StorageKey) => Promise<string | undefined>;
    
    readonly set: (key: StorageKey, value: string) => Promise<void>;
    
}


export type StorageChanges = {[key: string]: StorageChange};


export interface StorageImpl extends NonRefreshableStorageImpl {
    
    readonly refreshers: Callables<StorageChanges>;
    
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

const addRefreshers = function(storage: NonRefreshableStorageImpl): StorageImpl {
    return {
        ...storage,
        refreshers: Callables.new(),
    };
};

const browserStorageImpl = function(storage: BrowserStorage): StorageImpl {
    // noinspection CommaExpressionJS
    return addRefreshers({
        get: async key => storage[key],
        set: async (key, value) => (storage[key] = value, undefined),
    });
};

const chromeStorageImpl = function(storage: StorageArea): StorageImpl {
    return addRefreshers({
        get: async key => (await storage.get([key]))[key],
        set: async (key, value) => await storage.set({[key]: value}),
    });
};

export const storages: Storages = {
    
    browser: {
        local: browserStorageImpl(localStorage),
        session: browserStorageImpl(sessionStorage),
    },
    
    chrome: chromep.storage ? {
        local: chromeStorageImpl(chromep.storage.local),
        sync: chromeStorageImpl(chromep.storage.sync),
    } : {
        local: browserStorageImpl(localStorage),
        sync: browserStorageImpl(localStorage),
    },
    
};

addExtensions();

storages.freezeFields().freeze();

globals({storages});

chrome.storage && chrome.storage.onChanged.addListener((changes: StorageChanges, areaName: string) => {
    storages.chrome.sync.refreshers.call(changes);
});