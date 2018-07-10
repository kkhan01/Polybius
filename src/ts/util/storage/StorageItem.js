"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Callables_1 = require("../Callables");
const Storages_1 = require("./Storages");
exports.identitySerializer = function () {
    return {
        serialize: t => t,
        deserialize: async (u) => u,
    };
};
const makeTier = function (base, serializer) {
    return {
        get: async () => serializer.deserialize(await base.get()),
        set: async (u) => await base.set(serializer.serialize(u)),
    };
};
const cache = function ({ get, set, refresher }) {
    let cache = null;
    refresher.add(() => cache = null);
    return {
        get: () => cache || (cache = (async () => await get())()),
        set: async (t) => {
            refresher.call();
            cache = Promise.resolve(t);
            return await set(t);
        },
        refresher,
    };
};
const addMap = function (base) {
    const { get, set, refresher } = cache(base);
    // TODO fix refresh
    // right now setting a mapped item refreshes the delegate item
    // but setting the delegate item doesn't refresh the mapped item
    return {
        get,
        set,
        refresher,
        map: ({ serialize, deserialize }) => addMap({
            get: async () => deserialize(await get()),
            set: async (t) => await set(serialize(t)),
            refresher,
        }),
    };
};
const addArrayMap = function (base) {
    const { get, set, refresher } = cache(base);
    return {
        get,
        set,
        refresher,
        map: ({ serialize, deserialize }) => addArrayMap({
            get: async () => (await get()).asyncMap(deserialize),
            set: async (a) => await set(a.map(serialize)),
            refresher,
        }),
    };
};
exports.jsonSerializer = function () {
    return {
        serialize: JSON.stringify,
        deserialize: JSON.parse,
    };
};
exports.StorageItem = {
    newObject(args) {
        const { storageImpl = Storages_1.storages.chrome.sync, key, defaultValue, serializer = exports.jsonSerializer(), converter = exports.identitySerializer(), } = args;
        const defaultValueRaw = serializer.serialize(converter.serialize(defaultValue));
        // noinspection CommaExpressionJS
        const raw = {
            get: async () => await storageImpl.get(key) || defaultValueRaw,
            set: async (s) => storageImpl.set(key, s),
        };
        const serialized = makeTier(raw, serializer);
        const { get, set } = makeTier(serialized, converter);
        const refresher = Callables_1.Callables.new();
        storageImpl.refreshers.add(changes => {
            if (key in changes) {
                refresher.call();
            }
        });
        const cached = cache({ get, set, refresher });
        return addMap(cached).freeze();
    },
    newArray(args) {
        const { storageImpl, key, converter: { deserialize, serialize } = exports.identitySerializer(), serializer, } = args;
        return addArrayMap(exports.StorageItem.newObject({
            storageImpl,
            key,
            defaultValue: [],
            converter: {
                serialize: a => a.map(serialize),
                deserialize: a => a.asyncMap(deserialize),
            },
            serializer,
        })).freeze();
    },
};
exports.StorageItem.freeze();
//# sourceMappingURL=StorageItem.js.map