import {addExtensions} from "../extensions/allExtensions";
import {InvokeArgs, RawSandbox, RawSandboxedFunction, Result, sandbox, TypedMessage} from "./SandboxMessenger";

addExtensions();

// a shared global object accessible by all sandboxed functions
// this allows them to share code
const sandboxGlobal: Object = Object.create(null);

let nextFunctionId: number = 0;
const functions: Map<number, Function> = new Map();

const onMessage = function(event: MessageEvent): void {
    const {source, data} = event;
    if (!source) {
        return;
    }
    
    const {id, type, message} = data as TypedMessage<any>;
    if (id === null || id === undefined) {
        return; // w/o an id, can't even signal an error
    }
    
    const postMessage = function <T, Ex>(message: Result<T, Ex>): void {
        source.postMessage({id, message}, "*" || location.origin);
    };
    
    const postError = function <Ex = string>(message: Ex): void {
        postMessage({error: message, value: undefined});
    };
    
    const invokers: RawSandboxedFunction = {
        
        call(this: Function, thisArg: any, ...args: any[]): any {
            return this.call(thisArg, ...args);
        },
        
        bind(this: Function, thisArg: any, ...args: any[]): number {
            const boundFunc = this.bind(thisArg, ...args);
            const id = nextFunctionId++;
            functions.set(id, boundFunc);
            return id;
        },
        
    };
    
    const responders: RawSandbox = {
        
        evaluate(js: string): any {
            const wrappedFunc: Function = new Function("global", `"use strict"; return (${js})`);
            return wrappedFunc(sandboxGlobal);
        },
        
        compile(js: string): number {
            const func: Function = responders.evaluate(js);
            const id = nextFunctionId++;
            functions.set(id, func);
            return id;
        },
        
        invoke(invokeArgs: InvokeArgs): any {
            const {type, id, thisArg, args} = invokeArgs;
            
            if (!(type in invokers)) {
                postError(`Invalid InvokeType: ${type}`);
                return;
            }
            
            const func = functions.get(id);
            if (!func) {
                postError(`Invalid FunctionId: ${id}`);
                return;
            }
            
            return invokers[type].call(func, thisArg, ...args);
        },
        
    };
    
    if (!(type in responders)) {
        postError(`Invalid MessageType: ${type}`);
    }
    
    const postValue = function <T>(value: T): void {
        postMessage({value});
    };
    
    try {
        postValue((responders[type] as Function)(message));
    } catch (e) {
        if (e instanceof Error) {
            e = `${e.name}: ${e.message}`;
        }
        postError(e);
    }
    
};

export const initSandbox = function(): void {
    addEventListener("message", onMessage, false);
};