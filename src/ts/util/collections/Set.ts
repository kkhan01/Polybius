import {AsyncFilter, Filter} from "../functional/Filter";
import {Mapper} from "../functional/Mapper";
import {Collection, CollectionArgs} from "./Collection";
import {HashEquals, HashValue} from "./HashEquals";

export interface Set<E> extends Collection<E> {
    
    // override with specific return Set type
    filter(filter: Filter<E>): Set<E>;
    
    // override with specific return Set type
    map<T, H = HashValue>(map: Mapper<E, T>, args?: CollectionArgs<T, H>): Set<T>;
    
    // override with specific return Set type
    mapFilter<T, H = HashValue>(map: Mapper<E, OrFalsy<T>>, args?: CollectionArgs<T, H>): Set<T>;
    
    // override with specific return Set type
    asyncFilter(filter: AsyncFilter<E>): Promise<Set<E>>;
    
    // override with specific return Set type
    asyncMap<T, H = HashValue>(map: Mapper<E, Promise<T>>, args?: CollectionArgs<T, H>): Promise<Set<T>>;
    
    // override with specific return Set type
    asyncMapFilter<T, H = HashValue>(map: Mapper<E, Promise<OrFalsy<T>>>, args?: CollectionArgs<T, H>): Promise<Set<T>>;
    
    // override with specific return Set type
    clone(): Set<E>;
    
}