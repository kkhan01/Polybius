import {AsyncFilter, Filter} from "../functional/Filter";
import {Mapper} from "../functional/Mapper";
import {Collection, CollectionArgs} from "./Collection";
import {HashEquals, HashValue} from "./HashEquals";

export interface Queue<E> extends Collection<E> {
    
    offer(e: E): boolean;
    
    enqueue(e: E): void;
    
    poll(): E | undefined;
    
    removeElement(): E;
    
    dequeue(): E | undefined;
    
    peek(): E | undefined;
    
    getElement(): E;
    
    // override with specific return Queue type
    filter(filter: Filter<E>): Queue<E>;
    
    // override with specific return Queue type
    map<T, H = HashValue>(map: Mapper<E, T>, args?: CollectionArgs<T, H>): Queue<T>;
    
    // override with specific return Queue type
    mapFilter<T, H = HashValue>(map: Mapper<E, OrFalsy<T>>, args?: CollectionArgs<T, H>): Queue<T>;
    
    // override with specific return Queue type
    asyncFilter(filter: AsyncFilter<E>): Promise<Queue<E>>;
    
    // override with specific return Queue type
    asyncMap<T, H = HashValue>(map: Mapper<E, Promise<T>>, args?: CollectionArgs<T, H>): Promise<Queue<T>>;
    
    // override with specific return Queue type
    asyncMapFilter<T, H = HashValue>(map: Mapper<E, Promise<OrFalsy<T>>>, args?: CollectionArgs<T, H>): Promise<Queue<T>>;
    
    // override with specific return Queue type
    clone(): Queue<E>;
    
}