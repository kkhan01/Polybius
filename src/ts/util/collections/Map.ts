import {IfElse} from "../types/IfElse";
import {Collection} from "./Collection";
import {Set} from "./Set";

export interface MapEntry<K, V> {
    key: K;
    value: V;
}

interface Mapper<K, V, R> {
    (k: K): R;
}

interface ReMapper<K, V> {
    (k: K, v: V): V | undefined;
}

export interface Map<K, V> extends Set<MapEntry<K, V>> {
    
    put(k: K, v: V): V | undefined;
    
    putIfAbsent(k: K, v: V): void;
    
    putAll(map: Map<K, V>): void;
    
    replace(k: K, v: V): V | undefined;
    
    replaceIfEquals(k: K, oldValue: V, newValue: V): boolean;
    
    computeIfAbsent<WillExist extends boolean = boolean>(
        k: K, mapper: Mapper<K, V, IfElse<WillExist, V, undefined>>
    ): IfElse<WillExist, V, undefined>;
    
    computeIfPresent(k: K, remapper: ReMapper<K, V>): V | undefined;
    
    compute(k: K, remapper: ReMapper<K, V | undefined>): V | undefined;
    
    merge(k: K, v: V, remapper: ReMapper<K, V | undefined>): V | undefined;
    
    hasKey(k: K): boolean;
    
    hasValue(v: V): boolean;
    
    get(k: K): V | undefined;
    
    getOrDefault(k: K, defaultValue: V): V;
    
    removeKey(k: K): V | undefined;
    
    removeValue(v: V): boolean;
    
    entries(): Set<MapEntry<K, V>>;
    
    keys(): Set<K>;
    
    values(): Collection<V>;
    
    // TODO add hashEquals? to these?
    
    // mapValues<T>(map: _Mapper<V, T>): Map<K, T>;
    //
    // mapFilterValues<T>(map: _Mapper<V, OrFalsy<T>>): Map<K, T>;
    //
    // asyncMapValues<T>(map: _Mapper<V, Promise<T>>): Promise<Map<K, T>>;
    //
    // asyncMapFilterValues<T>(map: _Mapper<V, Promise<OrFalsy<T>>>): Promise<Map<K, T>>;
    
    clone(): Map<K, V>;
    
}