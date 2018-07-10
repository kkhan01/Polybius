"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HashEquals_1 = require("./HashEquals");
exports.checkSizeChanged = function (size, wrapped) {
    return arg => {
        const originalSize = size();
        wrapped(arg);
        return originalSize !== size();
    };
};
exports.Collection = {
    basedOn(base, hashEquals, constructor) {
        const { size, add, remove, clear } = base;
        const { hash, equals } = HashEquals_1.HashEquals.fastEquals(hashEquals);
        const makeHas = function (iter) {
            return e => [...iter].some(HashEquals_1.Equals.bind(equals, e));
        };
        const iterArray = function (method) {
            return (iter) => method([...iter]);
        };
        const iterArrayForEach = function (func) {
            return iterArray(a => a.forEach(func));
        };
        const _checkSizeChanged = function (wrapped) {
            return exports.checkSizeChanged(size, wrapped);
        };
        const construct = () => constructor;
        const asyncConstruct = () => async ({ hashEquals, elements }) => construct()({ hashEquals, elements: await elements });
        const maybeAsyncConstruct = ((async) => async ? asyncConstruct() : construct());
        const arrayMethod = function (getter, returner) {
            return (f, args) => {
                const a = _.toArray();
                const m = getter(a).bind(a);
                // Object spread is used here like this
                // so that all properties of args are included,
                // even if they are not in CollectionArgs.
                // This is b/c CollectionArgs can be subtyped,
                // but Collection won't know about it and can't know about it,
                // b/c Collection can't have higher kinded generic types.
                return returner({
                    ...{
                        hashEquals: HashEquals_1.HashEquals.default(),
                    },
                    ...args || {},
                    ...{
                        elements: m(f),
                    },
                });
            };
        };
        const forEachMethod = function (forEachGetter) {
            return arrayMethod(forEachGetter, (args) => args.elements);
        };
        const mappingMethod = function (mapGetter, async) {
            return arrayMethod(mapGetter, maybeAsyncConstruct(async));
        };
        const filteringMethod = function (filterGetter, async) {
            return (filter) => arrayMethod(filterGetter, maybeAsyncConstruct(async))(filter, { hashEquals });
        };
        const extended = {
            isEmpty: () => size() === 0,
            has: makeHas(base),
            hasAll: iterArray(a => a.every(_.has)),
            addAll: iterArrayForEach(add),
            removeAll: _checkSizeChanged(iterArrayForEach(remove)),
            retainAll: _checkSizeChanged(iter => _.retainIf(makeHas(iter))),
            removeIf: _checkSizeChanged(filter => _.toArray().filter(filter).forEach(remove)),
            retainIf: filter => _.removeIf(filter.negate()),
            replaceAll: replacer => {
                const mapped = _.toArray().map(replacer);
                clear();
                _.addAll(mapped);
            },
            toString: () => `[${_.toArray().join(", ")}]`,
            toArray: () => [..._],
            random: () => _.toArray().random(),
            forEach: forEachMethod(a => a.forEach),
            asyncForEach: forEachMethod(a => a.asyncForEach),
            equals: (c) => size() === c.size() && (() => {
                const a = c.toArray();
                return _.toArray().every((e, i) => equals(e, a[i]));
            })(),
            hash: () => _.toArray().map(hash).map(HashEquals_1.Hash.makeNumber).reduce((hash, h) => 31 * (hash | 0) + h, 1),
            filter: filteringMethod(a => a.filter, false),
            map: mappingMethod(a => a.map, false),
            mapFilter: mappingMethod(a => a.mapFilter, false),
            asyncFilter: filteringMethod(a => a.asyncFilter, true),
            asyncMap: mappingMethod(a => a.asyncMap, true),
            asyncMapFilter: mappingMethod(a => a.asyncMapFilter, true),
            clone: () => _.map(e => e),
        };
        // type system not good enough with difference types, need to assert
        const _ = Object.assign(base, extended);
        return _;
    },
};
//# sourceMappingURL=Collection.js.map