import {AsyncFilter, Filter} from "../functional/Filter";
import {Mapper} from "../functional/Mapper";
import {IfElse} from "../types/IfElse";
import {Difference, PartialDifference} from "../types/types";
import {Equals, Hash, HashEqualable, HashEquals, HashValue} from "./HashEquals";

export interface BaseCollection<E> extends Iterable<E> {
    
    size(): number;
    
    add(e: E): boolean;
    
    remove(e: E): boolean;
    
    clear(): void;
    
}

export interface ExtendedCollection<E> extends HashEqualable<Collection<E>> {
    
    isEmpty(): boolean;
    
    has(e: E): boolean;
    
    hasAll(iter: Iterable<E>): boolean;
    
    addAll(iter: Iterable<E>): void;
    
    removeAll(iter: Iterable<E>): boolean;
    
    removeIf<This>(filter: Filter<E>): boolean;
    
    retainAll(iter: Iterable<E>): boolean;
    
    retainIf<This>(filter: Filter<E>): boolean;
    
    replaceAll(replacer: (e: E) => E): void;
    
    toString(): string;
    
    toArray(): E[];
    
    forEach(func: Mapper<E, void>): void;
    
    asyncForEach(func: Mapper<E, Promise<void>>): Promise<void>;
    
    // override with specific return Collection type
    filter(filter: Filter<E>): Collection<E>;
    
    // override with specific return Collection type
    map<T, H = HashValue>(map: Mapper<E, T>, args?: CollectionArgs<T, H>): Collection<T>;
    
    // override with specific return Collection type
    mapFilter<T, H = HashValue>(map: Mapper<E, OrFalsy<T>>, args?: CollectionArgs<T, H>): Collection<T>;
    
    // override with specific return Collection type
    asyncFilter(filter: AsyncFilter<E>): Promise<Collection<E>>;
    
    // override with specific return Collection type
    asyncMap<T, H = HashValue>(map: Mapper<E, Promise<T>>, args?: CollectionArgs<T, H>): Promise<Collection<T>>;
    
    // override with specific return Collection type
    asyncMapFilter<T, H = HashValue>(map: Mapper<E, Promise<OrFalsy<T>>>,
                                     args?: CollectionArgs<T, H>): Promise<Collection<T>>;
    
    // override with specific return Collection type
    clone(): Collection<E>;
    
    // no reduce b/c not ordered
    
    random(): E;
    
}

export interface Collection<E> extends BaseCollection<E>, ExtendedCollection<E> {

}

export interface CollectionArgs<E, H> {
    
    hashEquals?: HashEquals<E, H>;
    
}

export interface NewCollectionArgs<E, H> extends CollectionArgs<E, H> {
    
    elements?: Iterable<E>;
    
}

export interface CollectionConstructor {
    
    <E, H>(args: NewCollectionArgs<E, H>): Collection<E>;
    
}

export interface CollectionClass {
    
    basedOn<E, H, This extends Collection<E>>(
        base: PartialDifference<ExtendedCollection<E>, This> & BaseCollection<E>,
        hashEquals: HashEquals<E, H>,
        constructor: CollectionConstructor,
    ): This;
}

export const checkSizeChanged = function <T>(size: () => number, wrapped: (arg: T) => void): (arg: T) => boolean {
    return arg => {
        const originalSize = size();
        wrapped(arg);
        return originalSize !== size();
    };
};

export const Collection: CollectionClass = {
    
    basedOn<E, H, This extends Collection<E>>(
        base: PartialDifference<ExtendedCollection<E>, This> & BaseCollection<E>,
        hashEquals: HashEquals<E, H>,
        constructor: CollectionConstructor,
    ): This {
        const {size, add, remove, clear} = base;
        
        const {hash, equals} = HashEquals.fastEquals(hashEquals);
        
        const makeHas = function(iter: Iterable<E>): typeof _.has {
            return e => [...iter].some(Equals.bind(equals, e));
        };
        
        const iterArray = function <R>(method: (a: E[]) => R) {
            return (iter: Iterable<E>) => method([...iter]);
        };
        
        const iterArrayForEach = function(func: Mapper<E, void>) {
            return iterArray(a => a.forEach(func));
        };
        
        const _checkSizeChanged = function <T>(wrapped: (arg: T) => void): (arg: T) => boolean {
            return checkSizeChanged(size, wrapped);
        };
        
        type ArrayGetter<Method> = (a: E[]) => Method;
        
        interface ArrayMethodReturnArgs<T, H, TR> {
            hashEquals: HashEquals<T, H>;
            elements: TR;
        }
        
        type Promisify<T, Async extends boolean> = IfElse<Async, Promise<T>, T>;
        
        type ArrayMethodReturner<T, H, TR, R> = (args: ArrayMethodReturnArgs<T, H, TR>) => R;
        type Constructor<T, H, Async extends boolean> =
            ArrayMethodReturner<T, H, Promisify<T[], Async>, Promisify<Collection<T>, Async>>;
        
        const construct = <T, H>(): Constructor<T, H, false> => constructor;
        
        const asyncConstruct = <T, H>(): Constructor<T, H, true> => async ({hashEquals, elements}) =>
            construct<T, H>()({hashEquals, elements: await elements});
        
        type MaybeAsyncConstruct = <T, H, Async extends boolean>(async: Async) => Constructor<T, H, Async>;
        
        const maybeAsyncConstruct: MaybeAsyncConstruct = <MaybeAsyncConstruct>
            (<T, H, Async extends boolean>(async: Async) => async ? asyncConstruct<T, H>() : construct<T, H>());
        
        const arrayMethod = function <F, T, H, TR, R>(
            getter: ArrayGetter<(f: F) => TR>,
            returner: ArrayMethodReturner<T, H, TR, R>,
        ) {
            return (f: F, args?: CollectionArgs<T, H>): R => {
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
                        hashEquals: HashEquals.default(),
                    },
                    ...args || {},
                    ...{
                        elements: m(f),
                    },
                });
            };
        };
        
        const forEachMethod = function <Void>(forEachGetter: ArrayGetter<(func: Mapper<E, Void>) => Void>) {
            return arrayMethod(forEachGetter, (args: ArrayMethodReturnArgs<E, H, Void>) => args.elements);
        };
        
        const mappingMethod = function <T, Async extends boolean>(
            mapGetter: ArrayGetter<(map: Mapper<E, Promisify<T, Async>>) => Promisify<T[], Async>>,
            async: Async,
        ) {
            return arrayMethod(mapGetter, maybeAsyncConstruct(async));
        };
        
        const filteringMethod = function <Async extends boolean, Bool extends Promisify<boolean, Async>>(
            filterGetter: ArrayGetter<(filter: Mapper<E, Bool>) => Promisify<E[], Async>>,
            async: Async,
        ) {
            return (filter: Mapper<E, Bool>) => arrayMethod(filterGetter, maybeAsyncConstruct(async))(
                filter, {hashEquals});
        };
        
        const extended: ExtendedCollection<E> = {
            
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
            
            equals: (c: Collection<E>): boolean => size() === c.size() && (() => {
                const a = c.toArray();
                return _.toArray().every((e, i) => equals(e, a[i]));
            })(),
            
            hash: () => _.toArray().map(hash).map(Hash.makeNumber).reduce((hash, h) => 31 * (hash | 0) + h, 1),
            
            filter: filteringMethod(a => a.filter, false),
            
            map: mappingMethod(a => a.map, false),
            
            mapFilter: mappingMethod(a => a.mapFilter, false),
            
            asyncFilter: filteringMethod(a => a.asyncFilter, true),
            
            asyncMap: mappingMethod(a => a.asyncMap, true),
            
            asyncMapFilter: mappingMethod(a => a.asyncMapFilter, true),
            
            clone: () => _.map(e => e),
            
        };
        
        // type system not good enough with difference types, need to assert
        const _: This = Object.assign(base, extended) as any as This;
        
        return _;
    },
    
    
};