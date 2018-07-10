import {AsyncFilter, Filter} from "../functional/Filter";
import {Mapper} from "../functional/Mapper";
import {Collection, CollectionArgs} from "./Collection";
import {Comparator} from "./Comparator";
import {HashEquals, HashValue} from "./HashEquals";

export interface List<E> extends Collection<E> {
    
    get(i: number): E;
    
    first(): E;
    
    last(): E;
    
    set(i: number, e: E): E;
    
    addAt(i: number, e: E): void;
    
    addAllAt(i: number, iter: Iterable<E>): boolean;
    
    removeAt(i: number): E;
    
    pop(): E;
    
    indexOf(e: E): number;
    
    lastIndexOf(e: E): number;
    
    reverse(): void;
    
    reversed(): List<E>;
    
    sort(comparator: Comparator<E>): void;
    
    sorted(comparator: Comparator<E>): List<E>;
    
    sortBy<T, H = HashValue>(map: (e: E) => T): void;
    
    sortedBy<T, H = HashValue>(map: (e: E) => T): List<E>;
    
    subList(from: number, to: number): List<E>;
    
    // override with specific return List type
    filter(filter: Filter<E>): List<E>;
    
    // override with specific return List type
    map<T, H = HashValue>(map: Mapper<E, T>, args?: CollectionArgs<T, H>): List<T>;
    
    // override with specific return List type
    mapFilter<T, H = HashValue>(map: Mapper<E, OrFalsy<T>>, args?: CollectionArgs<T, H>): List<T>;
    
    // override with specific return List type
    asyncFilter(filter: AsyncFilter<E>): Promise<List<E>>;
    
    // override with specific return List type
    asyncMap<T, H = HashValue>(map: Mapper<E, Promise<T>>, args?: CollectionArgs<T, H>): Promise<List<T>>;
    
    // override with specific return List type
    asyncMapFilter<T, H = HashValue>(map: Mapper<E, Promise<OrFalsy<T>>>, args?: CollectionArgs<T, H>): Promise<List<T>>;
    
    // override with specific return List type
    clone(): List<E>;
    
}