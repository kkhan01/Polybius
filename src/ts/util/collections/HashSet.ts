import {bind} from "../decorators/bind";
import {AsyncFilter, Filter} from "../functional/Filter";
import {Mapper} from "../functional/Mapper";
import {NativeSet} from "../types/typeAliases";
import {checkSizeChanged, Collection, CollectionArgs, CollectionConstructor, NewCollectionArgs} from "./Collection";
import {HashEquals, HashValue} from "./HashEquals";
import {Map} from "./Map";
import {Set} from "./Set";

export interface HashSet<E> extends Set<E> {
    
    // override with specific return HashSet type
    filter(filter: Filter<E>): HashSet<E>;
    
    // override with specific return HashSet type
    map<T, H = HashValue>(map: Mapper<E, T>, args?: CollectionArgs<T, H>): HashSet<T>;
    
    // override with specific return HashSet type
    mapFilter<T, H = HashValue>(map: Mapper<E, OrFalsy<T>>, args?: CollectionArgs<T, H>): HashSet<T>;
    
    // override with specific return HashSet type
    asyncFilter(filter: AsyncFilter<E>): Promise<HashSet<E>>;
    
    // override with specific return HashSet type
    asyncMap<T, H = HashValue>(map: Mapper<E, Promise<T>>, args?: CollectionArgs<T, H>): Promise<HashSet<T>>;
    
    // override with specific return HashSet type
    asyncMapFilter<T, H = HashValue>(map: Mapper<E, Promise<OrFalsy<T>>>,
                                     args?: CollectionArgs<T, H>): Promise<HashSet<T>>;
    
    // override with specific return HashSet type
    clone(): HashSet<E>;
    
}

export interface HashSetClass {
    
    "new"<E, H = HashValue>(args: NewCollectionArgs<E, H>): HashSet<E>;
    
    referential<E>(args: NewCollectionArgs<E, E>): HashSet<E>;
    
}

export const HashSet: HashSetClass = {
    
    new<E, H>({elements = [], hashEquals = HashEquals.default()}: NewCollectionArgs<E, H>): HashSet<E> {
        if (HashEquals.isReferential(hashEquals)) {
            // if using referential HashEquals, use optimized referential version
            return HashSet.referential({elements});
        }
        
        const {value, done} = elements[Symbol.iterator]().next();
        if (!done && !["object", "function"].includes(typeof value)) {
            // if using a primitive type, always use referential version
            return HashSet.referential({elements}); // don't need hashEquals
        }
        
        const map: Map<E, null> = {} as any; // TODO // HashMap.new(hashEquals);
        
        const {
            size,
            clear,
            hasKey: has,
            put,
            removeKey: remove,
            keys,
            replaceAll,
        } = map;
        // noinspection TypeScriptValidateJSTypes
        return Collection.basedOn<E, H, HashSet<E>>({
            size,
            add: e => put(e, null) !== null,
            remove: e => remove(e) === null,
            clear,
            [Symbol.iterator]: () => keys()[Symbol.iterator](), // make sure HashMap.keys() doesn't use HashSet
            has,
            replaceAll: replacer => replaceAll(({key, value}) => ({key: replacer(key), value})),
        }, hashEquals, HashSet.new);
    },
    
    referential<E>(args: NewCollectionArgs<E, E>): HashSet<E> {
        const {elements = []} = args;
        // always use referential HashEquals, ignore args
        const hashEquals = HashEquals.referential<E>();
        const nativeSet: NativeSet<E> = bind(new NativeSet<E>(elements));
        const {add, has, delete: remove, clear, [Symbol.iterator]: iterator, forEach} = nativeSet;
        const size = () => nativeSet.size;
        // noinspection TypeScriptValidateJSTypes
        return Collection.basedOn({
            size,
            add: checkSizeChanged(size, add),
            remove,
            clear,
            [Symbol.iterator]: () => iterator(),
            has,
            forEach: (func => {
                let i = 0;
                forEach(e => func(e, i++));
            }),
            // TODO should I type assert this
        }, hashEquals, HashSet.referential as CollectionConstructor);
    },
    
};