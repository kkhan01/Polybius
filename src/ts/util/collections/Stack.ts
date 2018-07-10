import {AsyncFilter, Filter} from "../functional/Filter";
import {Mapper} from "../functional/Mapper";
import {Collection, CollectionArgs} from "./Collection";
import {HashEquals, HashValue} from "./HashEquals";

export interface PureStack<E> {
    
    push(e: E): void;
    
    peek(): E | undefined;
    
    pop(): E | undefined;
    
}

export interface Stack<E> extends PureStack<E>, Collection<E> {
    
    // override with specific return Stack type
    filter(filter: Filter<E>): Stack<E>;

    // override with specific return Stack type
    map<T, H = HashValue>(map: Mapper<E, T>, args?: CollectionArgs<T, H>): Stack<T>;

    // override with specific return Stack type
    mapFilter<T, H = HashValue>(map: Mapper<E, OrFalsy<T>>, args?: CollectionArgs<T, H>): Stack<T>;

    // override with specific return Stack type
    asyncFilter(filter: AsyncFilter<E>): Promise<Stack<E>>;

    // override with specific return Stack type
    asyncMap<T, H = HashValue>(map: Mapper<E, Promise<T>>, args?: CollectionArgs<T, H>): Promise<Stack<T>>;

    // override with specific return Stack type
    asyncMapFilter<T, H = HashValue>(map: Mapper<E, Promise<OrFalsy<T>>>, args?: CollectionArgs<T, H>): Promise<Stack<T>>;
    
    // override with specific return Stack type
    clone(): Stack<E>;
    
}