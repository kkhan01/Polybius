declare interface HTMLAppendable<T> {
    
    appendTo(parent: HTMLElement): T;
    
}

declare interface ObjectConstructor {
    
    defineSharedProperties(object: any, sharedDescriptor: PropertyDescriptor, propertyValues: Object): void;
    
    defineImmutableProperties(object: any, propertyValues: Object): void;
    
    getting<T, K extends keyof T>(key: K): (o: T) => T[K];
    
    deleting<T, K extends keyof T>(key: K): (o: T) => T;
    
}

declare interface Object {
    
    freeze<T>(this: T): T;
    
    seal<T>(this: T): T;
    
    // _ is b/c there are other objects with slightly different clone methods
    _clone<T>(this: T): T;
    
    mapFields<T, U, KT extends keyof T, KU extends keyof U>(this: T, mapper: (field: T[KT]) => U[KU]): U;
    
    mapFields<T, U>(this: {[field: string]: T}, mapper: (field: T) => U): {[field: string]: U};
    
    freezeFields<T>(this: T): T;
    
}

declare interface FunctionConstructor {
    
    compose(...funcs: Function[]): Function;
    
}

declare interface Function {
    
    then<T, U, V>(this: (arg: T) => U, nextFunc: (arg: U) => V): (arg: T) => V;
    
    applyReturning<T>(this: (arg: T) => void): (arg: T) => T;
    
    mapping<T, U>(this: (arg: T) => U): (array: T[]) => U[];
    
    applying<T, U>(this: (...args: T[]) => U): (array: T[]) => U;
    
    timed<T>(this: T): T;
    
    setName(name: string): void;
    
    named<T>(this: T, name: string): T;
    
    negate<T extends (...args: any[]) => boolean>(this: T): T;
    
}

declare interface Array<T> {
    
    last(): T;
    
    clear(): void;
    
    removeAt(index: number): T;
    
    remove(value: T): T | undefined;
    
    add(index: number, value: T): void;
    
    addAll(values: T[], index?: number): void;
    
    applyOn<T, U>(this: T[], func: (args: T[]) => U): U;
    
    callOn<T, U>(this: T[], func: (...args: T[]) => U): U;
    
    toObject<T, K extends keyof T>(this: [K, T[K][]]): T;
    
    toObject<T>(this: [string, T][]): {[property: string]: T};
    
    toObject(this: [string, any][]): any;
    
    sortBy<T, U>(this: T[], key: (t: T) => U): T[];
    
    random<T>(this: T[]): T;
    
}

declare interface NumberConstructor {
    
    isNumber(n: number): boolean;
    
    toPixels(n: number): string;
    
}

declare interface Node {
    
    appendBefore(node: Node): Node;
    
    appendAfter(node: Node): Node;
    
}

declare interface Element {
    
    clearHTML(): void;
    
    setAttributes(attributes: {[name: string]: any}): void;
    
}

declare interface HTMLElement {
    
    appendTo<T extends HTMLElement>(this: T, parent: HTMLElement): T;
    
    appendNewElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
    
    appendNewElement(tagName: string): HTMLElement;
    
    appendDiv(): HTMLDivElement;
    
    appendButton(buttonText: string): HTMLButtonElement;
    
    appendBr(): HTMLBRElement;
    
    withInnerText<T extends HTMLElement>(this: T, text: string): T;
    
    withInnerHTML<T extends HTMLElement>(this: T, html: string): T;
    
}

declare interface HTMLElement extends HTMLAppendable<HTMLElement> {

}