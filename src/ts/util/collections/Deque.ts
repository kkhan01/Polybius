import {AsyncFilter, Filter} from "../functional/Filter";
import {Mapper} from "../functional/Mapper";
import {CollectionArgs} from "./Collection";
import {HashEquals, HashValue} from "./HashEquals";
import {Queue} from "./Queue";
import {Stack} from "./Stack";

export interface Deque<E> extends Queue<E>, Stack<E> {
    
    addFirst(e: E): void;
    
    addLast(e: E): void;
    
    offerFirst(e: E): boolean;
    
    offerLast(e: E): boolean;
    
    pollFirst(): E | undefined;
    
    pollLast(): E | undefined;
    
    removeFirst(): E;
    
    removeLast(): E;
    
    peekFirst(): E | undefined;
    
    peekLast(): E | undefined;
    
    getFirst(): E;
    
    getLast(): E;
    
    removeFirstOccurrence(e: E): boolean;
    
    removeLastOccurrence(e: E): boolean;
    
    reverse(): void;
    
    reversed(): Deque<E>;
    
    // override with specific return Deque type
    filter(filter: Filter<E>): Deque<E>;
    
    // override with specific return Deque type
    map<T, H = HashValue>(map: Mapper<E, T>, args?: CollectionArgs<T, H>): Deque<T>;
    
    // override with specific return Deque type
    mapFilter<T, H = HashValue>(map: Mapper<E, OrFalsy<T>>, args?: CollectionArgs<T, H>): Deque<T>;
    
    // override with specific return Deque type
    asyncFilter(filter: AsyncFilter<E>): Promise<Deque<E>>;
    
    // override with specific return Deque type
    asyncMap<T, H = HashValue>(map: Mapper<E, Promise<T>>, args?: CollectionArgs<T, H>): Promise<Deque<T>>;
    
    // override with specific return Deque type
    asyncMapFilter<T, H = HashValue>(map: Mapper<E, Promise<OrFalsy<T>>>, args?: CollectionArgs<T, H>): Promise<Deque<T>>;
    
    // override with specific return Deque type
    clone(): Deque<E>;
    
}