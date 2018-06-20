import {bind} from "./decorators/bind";

export interface Callable<T = undefined> {
    
    (t: T): void;
    
}

interface PolymorphicCall<T, This> {
    
    (t: T): void;
    
    (this: This): void;
    
}

export interface Callables<T = undefined> {
    
    add(callable: Callable<T>): void;
    
    call: PolymorphicCallable<T>;
    
}

type PolymorphicCallable<T> = PolymorphicCall<T, Callables<T>>;

export const Callables = {
    
    new<T = undefined>(): Callables<T> {
        const {push: add, callEach: _call}: Callable<T>[] = bind([]);
        const call = _call as PolymorphicCallable<T>;
        return {add, call};
    },
    
};