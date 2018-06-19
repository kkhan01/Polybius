import {bind} from "./decorators/bind";

export interface Callable {
    
    (): void;
    
}

export interface Callables  {
    
    add(callable: Callable): void;
    
    call(): void;
    
}

export const Callables = {
    
    new(): Callables {
        
        const {push: add, callEach: call}: Callable[] = bind([]);
        
        return {
            add,
            call,
        };
        
    },
    
};