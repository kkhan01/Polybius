import {globals} from "../anyWindow";
import {addExtensions} from "../extensions/allExtensions";

addExtensions();

export interface SandboxedFunction<R, Ex = any> extends Function {
    
    (...args: any[]): Promise<R>;
    
    bind(thisArg: any, ...args: any[]): Promise<SandboxedFunction<R, Ex>>;
    
    bind<T extends SandboxedFunction<R, Ex>>(this: T, thisArg: any): Promise<T>;
    
}

export interface SandboxMessenger {
    
    evaluate<R = any>(js: string): Promise<R>;
    
    compile<R, Ex = any>(js: string): Promise<SandboxedFunction<R, Ex>>;
    
}

export interface RawSandboxedFunction {
    
    call(this: Function, thisArg: any, ...args: any[]): any;
    
    bind(this: Function, thisArg: any, ...args: any[]): number;
    
}

export interface RawSandbox {
    
    evaluate(js: string): any;
    
    compile(js: string): number;
    
    invoke(args: InvokeArgs): any;
    
}

export type InvokeType = keyof RawSandboxedFunction;

export type MessageType = keyof RawSandbox;

interface PendingPromise {
    resolve(value: any): void;
    
    reject(value: any): void;
}

export interface Message<T> {
    readonly id: number;
    readonly message: T;
}

export interface TypedMessage<T> extends Message<T> {
    readonly type: MessageType;
}

export interface Args {
    readonly thisArg: any;
    readonly args: ReadonlyArray<any>,
}

export interface InvokeArgs extends Args {
    readonly type: InvokeType;
    readonly id: number;
}

export interface Result<R, Ex> {
    
    readonly value: R;
    readonly error?: Ex;
    
}

const createIframeSandbox = function(src: string): Promise<ActiveHTMLIFrameElement> {
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.hidden = true;
    const activatedIframe = iframe.activate();
    return new Promise(resolve => {
        iframe.onload = () => {
            resolve(activatedIframe);
        };
    });
};

export const SandboxMessenger = {
    
    async new(src: string): Promise<SandboxMessenger> {
        const iframe = await createIframeSandbox(src);
        globals({iframe});
        const window = iframe.contentWindow;
        
        let nextId: number = 0;
        const promises: Map<number, PendingPromise> = new Map();
        
        const postMessage = function <T, R, Ex>(type: MessageType, message: T): Promise<R> {
            const id = nextId++;
            const typedMessage: TypedMessage<T> = {id, type, message};
            window.postMessage(typedMessage, "*" || location.origin);
            return new Promise((resolve, reject) => {
                promises.set(id, {resolve, reject});
            });
        };
        
        const onMessage = function(event: MessageEvent): void {
            const {id, message: {value, error}} = event.data as Message<Result<any, any>>;
            const pendingPromise = promises.get(id);
            if (pendingPromise) {
                const {resolve, reject} = pendingPromise;
                if (error) {
                    reject(error);
                }
                resolve(value);
            }
        };
        addEventListener("message", onMessage, false);
        
        const postFunctionMessage = function <R, Ex>(args: InvokeArgs): Promise<R> {
            return postMessage<InvokeArgs, R, Ex>("invoke", args);
        };
        
        const newSandboxedFunction = function <R, Ex>(id: number): SandboxedFunction<R, Ex> {
            
            const invokeArgs = function(type: InvokeType, thisArg: any, args: any[]): InvokeArgs {
                return {type, id, thisArg, args};
            };
            
            const f = function(this: any, ...args: any[]): Promise<R> {
                return postFunctionMessage<R, Ex>(invokeArgs("call", this, args));
            };
            
            // override Function.bind() b/c it's more efficient to bind on the sandbox side
            f.bind = async function(thisArg: any, ...args: any[]): Promise<SandboxedFunction<R, Ex>> {
                const id = await postFunctionMessage<number, string>(invokeArgs("bind", args, thisArg));
                return newSandboxedFunction(id);
            };
            
            return f;
        };
        
        const evaluate = function <R>(js: string): Promise<R> {
            return postMessage<string, R, string>("evaluate", js);
        };
        
        const compile = async function <R, Ex>(js: string): Promise<SandboxedFunction<R, Ex>> {
            const id = await postMessage<string, number, string>("compile", js);
            return newSandboxedFunction(id);
        };
        
        return {
            compile,
            evaluate,
        };
    },
    
};

export const sandboxMain = async function(): Promise<void> {
    const sandbox = await SandboxMessenger.new("sandbox.html");
    globals({sandbox});
    console.log(sandbox);
    const f = await sandbox.compile("(a, b) => a + b");
    console.log(f);
    const y = await f(2, 3);
    console.log(y);
};

export const sandbox: Promise<SandboxMessenger> = SandboxMessenger.new("sandbox.html");