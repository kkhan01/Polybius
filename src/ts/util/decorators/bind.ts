import {anyWindow, globals} from "../anyWindow";
import {addExtensions} from "../extensions/allExtensions";

addExtensions();

export const bind = function <T>(target: T): T {
    if (typeof target !== "object") {
        throw new Error(`cannot bind non-object: ${target}`);
    }
    
    const _target = target as {[key: string]: any};
    
    const isBindable = (value: any) => value.bind && !value.bound; // don't double bind methods
    const bind = (f: Function) => {
        f = f.bind(_target);
        (f as any).bound = true;
        return f;
    };
    
    const properties = Object.getAllPropertyNames(target)
        .map(key => ({key, value: _target[key]}))
        .filter(({value}) => isBindable(value))
        .map(({key, value}) => [key, bind(value)] as [string, Function])
        .toObject();
    
    Object.defineImmutableProperties(target, properties);
    
    return target;
};

globals({bind});

interface Class<T> {
    
    new(...args: any[]): T;
    
}

export const bindClass = function <T>(Target: Class<T>): Class<T> {
    return class extends (Target as any) {
        
        // noinspection JSUnusedGlobalSymbols
        public constructor(...args: any[]) {
            super(...args);
            bind(this);
        }
        
    } as Class<T>;
};