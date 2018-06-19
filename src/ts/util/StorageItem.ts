import {StorageKey} from "../polybius/Storage";
import {Callable, Callables} from "./Callables";
import {StorageImpl, Storages} from "./Storages";

interface BaseStorageItem<T> {
    
    readonly get: () => Promise<T>;
    
    readonly set: (t: T) => Promise<void>;
    
}

interface Refreshable {
    
    readonly refresher: Callables;
    
}

interface RefreshableStorageItem<T> extends BaseStorageItem<T>, Refreshable {

}

export interface StorageItem<T> extends RefreshableStorageItem<T> {
    
    readonly map: <U>(map: Serializer<U, T>) => StorageItem<U>;
    
}

interface RefreshableStorageItems<T> extends RefreshableStorageItem<T[]> {

}

export interface StorageItems<T> extends RefreshableStorageItems<T> {
    
    readonly map: <U>(map: Serializer<U, T>) => StorageItems<U>;
    
}

export type StorageMap = {[key: string]: RefreshableStorageItem<any>};

interface Serializer<T, U = string> {
    
    readonly serialize: (t: T) => U;
    
    readonly deserialize: (u: U) => T;
    
}

interface StorageItemBaseArgs {
    
    readonly storageImpl?: StorageImpl;
    readonly key: StorageKey;
    
}

interface StorageItemSimpleArgs<T> extends StorageItemBaseArgs {
    
    readonly defaultValue: T;
    
}

interface StorageItemNoConverterArgs<T> extends StorageItemSimpleArgs<T> {
    
    readonly serializer?: Serializer<T, string>;
    
}

interface StorageItemConverterArgs<T, U> extends StorageItemSimpleArgs<T> {
    
    readonly converter: Serializer<T, U>;
    readonly serializer?: Serializer<U, string>;
    
}

type StorageItemArgs<T, U> = StorageItemNoConverterArgs<T> | StorageItemConverterArgs<T, U>;

interface StorageItemsNoConverterArgs<T> extends StorageItemBaseArgs {
    
    readonly serializer?: Serializer<T[], string>;
    
}

interface StorageItemsConverterArgs<T, U> extends StorageItemBaseArgs {
    
    readonly converter: Serializer<T, U>;
    readonly serializer?: Serializer<U[], string>;
    
}

type StorageItemsArgs<T, U> = StorageItemsNoConverterArgs<T> | StorageItemsConverterArgs<T, U>;

interface StorageItemConstructor {
    
    <T>(args: StorageItemNoConverterArgs<T>): StorageItem<T>;
    
    <T, U>(args: StorageItemConverterArgs<T, U>): StorageItem<T>;
    
}

interface StorageItemsConstructor {
    
    <T>(args: StorageItemsNoConverterArgs<T>): StorageItems<T>;
    
    <T, U>(args: StorageItemsConverterArgs<T, U>): StorageItems<T>;
    
}

interface StorageItemClass {
    
    newObject: StorageItemConstructor;
    
    newArray: StorageItemsConstructor;
    
}

export const identitySerializer = function <T, U>(): Serializer<T, U> {
    return {
        serialize: t => t as any as U,
        deserialize: u => u as any as T,
    };
};

const makeTier = function <T, U>(base: BaseStorageItem<T>, serializer: Serializer<U, T>): BaseStorageItem<U> {
    return {
        get: async () => serializer.deserialize(await base.get()),
        set: async (u: U) => await base.set(serializer.serialize(u)),
    };
};

const cache = function <T>({get, set, refresher}: RefreshableStorageItem<T>): RefreshableStorageItem<T> {
    let cache: Promise<T> | null = null;
    refresher.add(() => cache = null);
    return {
        get: () => cache || (cache = (async () => await get())()),
        set: async t => {
            refresher.call();
            cache = Promise.resolve(t);
            return await set(t);
        },
        refresher,
    };
};

const addMap = function <T>(base: RefreshableStorageItem<T>): StorageItem<T> {
    const {get, set, refresher} = cache(base);
    // TODO fix refresh
    // right now setting a mapped item refreshes the delegate item
    // but setting the delegate item doesn't refresh the mapped item
    return {
        get,
        set,
        refresher,
        map: ({serialize, deserialize}) => addMap({
            get: async () => deserialize(await get()),
            set: async t => await set(serialize(t)),
            refresher,
        }),
    };
};

const addArrayMap = function <T>(base: RefreshableStorageItems<T>): StorageItems<T> {
    const {get, set, refresher} = cache(base);
    return {
        get,
        set,
        refresher,
        map: ({serialize, deserialize}) => addArrayMap({
            get: async () => (await get()).map(deserialize),
            set: async a => await set(a.map(serialize)),
            refresher,
        }),
    };
};

export const jsonSerializer = function <T>(): Serializer<T> {
    return {
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    };
};

export const StorageItem: StorageItemClass = {
    
    newObject<T, U>(args: StorageItemArgs<T, U>): StorageItem<T> {
        const {
            storageImpl = Storages.local,
            key,
            defaultValue,
            serializer = jsonSerializer<U>(),
            converter = identitySerializer<T, U>(),
        } = args as StorageItemConverterArgs<T, U>;
        
        const defaultValueRaw: string = serializer.serialize(converter.serialize(defaultValue));
        
        // noinspection CommaExpressionJS
        const raw: BaseStorageItem<string> = {
            get: async () => await storageImpl.get(key) || defaultValueRaw,
            set: async (s: string) => storageImpl.set(key, s),
        };
        
        const serialized = makeTier(raw, serializer);
        const {get, set} = makeTier(serialized, converter);
        const cached = cache({get, set, refresher: Callables.new()});
        return addMap(cached).freeze();
    },
    
    newArray<T, U>(args: StorageItemsArgs<T, U>): StorageItems<T> {
        const {
            storageImpl,
            key,
            converter: {deserialize, serialize} = identitySerializer<T, U>(),
            serializer,
        } = args as StorageItemsConverterArgs<T, U>;
        return addArrayMap(StorageItem.newObject<T[], U[]>({
            storageImpl,
            key,
            defaultValue: [],
            converter: {
                serialize: a => a.map(serialize),
                deserialize: a => a.map(deserialize),
            },
            serializer,
        }));
    },
    
};

StorageItem.freeze();