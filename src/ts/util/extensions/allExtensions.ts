import {Test} from "../functional/Test";

const immutableDescriptor: PropertyDescriptor = Object.freeze({
    writable: false,
    enumerable: false,
    configurable: true,
});

const defineSharedProperties = function(obj: any, sharedDescriptor: PropertyDescriptor, propertyValues: Object,
                                        overwrite: boolean = true): void {
    const properties: PropertyDescriptorMap & ThisType<any> = Object.getOwnPropertyDescriptors(propertyValues);
    Object.entries(properties).forEach(([propertyName, property]) => {
        if (!overwrite && obj[propertyName]) {
            return;
        }
        property = {...property, ...sharedDescriptor};
        if (property.get || property.set) {
            delete property.writable;
        }
        properties[propertyName] = property;
    });
    Object.defineProperties(obj, properties);
};

defineSharedProperties(Object, immutableDescriptor, {
    
    defineSharedProperties,
    
    defineImmutableProperties(obj: any, propertyValues: Object, overwrite: boolean = true): void {
        defineSharedProperties(obj, immutableDescriptor, propertyValues, overwrite);
    },
    
});

Object.defineImmutableProperties(Object, {
    
    definePolyfillProperties(obj: any, propertyValues: Object): void {
        Object.defineImmutableProperties(obj, propertyValues, false);
    },
    
    getPrototypeChain(object: any): Object[] {
        const chain: Object[] = [];
        for (let o = object; o !== null; o = Object.getPrototypeOf(o)) {
            chain.push(o);
        }
        return chain;
    },
    
    getAllPropertyNames(object: any): string[] {
        return Array.from(
            new Set(
                Object.getPrototypeChain(object)
                    .flatMap(Object.getOwnPropertyNames)
            )
        );
    },
    
    getting<T, K extends keyof T>(key: K): (o: T) => T[K] {
        return o => o[key];
    },
    
    deleting<T, K extends keyof T>(key: K): (o: T) => T {
        return o => {
            delete o[key];
            return o;
        };
    },
    
});

Object.defineImmutableProperties(Object.prototype, {
    
    freeze<T>(this: T): T {
        return Object.freeze(this);
    },
    
    seal<T>(this: T): T {
        return Object.seal(this);
    },
    
    _clone<T>(this: T): T {
        return Object.assign(Object.create(null), this);
    },
    
    fullClone<T>(this: T): T {
        return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    },
    
    mapFields<T, U>(this: {[field: string]: T}, mapper: (field: T) => U): {[field: string]: U} {
        const obj: {[field: string]: U} = Object.create(null);
        for (const [key, value] of Object.entries(this)) {
            obj[key] = mapper(value);
        }
        return obj;
    },
    
    freezeFields<T>(this: T): T {
        for (const value of Object.values(this)) {
            value.freeze();
        }
        return this;
    }
    
});

Object.defineImmutableProperties(Function, {
    
    compose(...funcs: Function[]): Function {
        const numFuncs: number = funcs.length;
        if (numFuncs === 0) {
            return () => undefined;
        }
        const [firstFunc, ...restFunc] = funcs;
        if (numFuncs === 1) {
            return firstFunc();
        }
        return function(...args: any[]) {
            let result = firstFunc();
            for (const func of funcs) {
                result = func(result);
            }
            return result;
        };
    },
    
});

Object.defineImmutableProperties(Function.prototype, {
    
    thenCall<T, U, V>(this: (arg: T) => U, nextFunc: (arg: U) => V): (arg: T) => V {
        return (arg: T) => nextFunc(this(arg));
    },
    
    applyReturning<T>(this: (arg: T) => void): (arg: T) => T {
        return (arg: T) => {
            this(arg);
            return arg;
        };
    },
    
    mapping<T, U>(this: (arg: T) => U): (array: T[]) => U[] {
        return array => array.map(this);
    },
    
    applying<T, U>(this: (...args: T[]) => U): (array: T[]) => U {
        return array => this(...array);
    },
    
    timed<T extends Function>(this: T): T {
        const timer = (...args: any[]) => {
            const {name} = this;
            console.time(name);
            const returnValue = this(...args);
            console.timeEnd(name);
            return returnValue;
        };
        return <T> <any> timer.named("timing_" + this.name);
    },
    
    setName<T extends Function>(this: T, name: string): void {
        Object.defineProperties(this, {
            name: {
                value: name,
            },
        });
    },
    
    named<T extends Function>(this: T, name: string): T {
        this.setName(name);
        return this;
    },
    
    negate<T extends (...args: any[]) => boolean>(this: T): T {
        return <T> ((...args: any[]) => !this(...args));
    },
    
});

Object.defineImmutableProperties(Array.prototype, {
    
    last<T>(this: T[]): T {
        return this[this.length - 1];
    },
    
    clear<T>(this: T[]): void {
        this.length = 0;
    },
    
    removeAt<T>(this: T[], index: number): T {
        return this.splice(index, 1)[0];
    },
    
    remove<T>(this: T[], value: T): T | undefined {
        const i: number = this.indexOf(value);
        if (i !== -1) {
            return this.removeAt(i);
        }
    },
    
    add<T>(this: T[], index: number, value: T): void {
        this.splice(index, 0, value);
    },
    
    addAll<T>(this: T[], values: T[], index: number = this.length): void {
        if (index === this.length) {
            this.push(...values);
        } else {
            this.splice(index, 0, ...values);
        }
    },
    
    applyOn<T, U>(this: T[], func: (args: T[]) => U): U {
        return func(this);
    },
    
    callOn<T, U>(this: T[], func: (...args: T[]) => U): U {
        return func(...this);
    },
    
    toObject<T>(this: [string, T][]): {[key: string]: T} {
        let o: {[key: string]: T} = Object.create(null);
        for (const [k, v] of this) {
            o[k] = v;
        }
        return o;
    },
    
    sortBy<T, U extends number>(this: T[], key: (t: T) => U): T[] {
        this.sort((a, b) => key(a) - key(b));
        return this;
    },
    
    random<T>(this: T[]): T {
        return this[Math.floor(Math.random() * this.length)];
    },
    
    mapCall<U, T extends () => U>(this: T[]): U[] {
        return this.map(f => f());
    },
    
    callEach<T extends (u: U) => void, U = undefined>(this: T[], u: U): void {
        this.forEach(f => f(u));
    },
    
});

Object.definePolyfillProperties(Array.prototype, {
    
    flatMap<T, U, This = undefined>(
        this: T[],
        flatMap: (this: This, value: T, index: number, array: T[]) => U | U[],
        thisArg?: This): U[] {
        if (thisArg) {
            flatMap = flatMap.bind(thisArg);
        }
        return ([] as U[]).concat(...this.map(flatMap));
    },
    
    flatten<T>(this: T[], depth: number = -1): any[] {
        return depth === 0
            ? this
            : this.reduce(
                (a, e: any | any[]) => a.concat(Array.isArray(e) ? e.flatten(depth - 1) : e),
                [],
            );
    },
    
});

const nativeSlice = String.prototype.slice;

Object.defineImmutableProperties(String.prototype, {
    
    equals(this: string, s: string): boolean {
        return this === s;
    },
    
    boundEquals(this: string): (s: string) => boolean {
        return s => this === s;
    },
    
    // allow negative indices for end
    slice(this: string, start: number = 0, end: number = this.length) {
        if (end < 0) {
            end = this.length + end;
        }
        return nativeSlice.call(this, start, end);
    },
    
});

Object.defineImmutableProperties(Number, {
    
    isNumber(n: number): boolean {
        return !Number.isNaN(n);
    },
    
    toPixels(n: number): string {
        return Math.round(n) + "px";
    },
    
});

Object.defineImmutableProperties(RegExp.prototype, {
    
    boundTest(this: RegExp): (s: string) => boolean {
        return s => this.test(s);
    },
    
    boundExec(this: RegExp): (s: string) => RegExpExecArray | null {
        return s => this.exec(s);
    },
    
    toSource(this: RegExp): string {
        const {source, flags} = this;
        return `/${source}/${flags}`;
    },
    
});

Object.defineImmutableProperties(Node.prototype, {
    
    appendBefore(this: Node, node: Node): Node {
        const {parentNode} = this;
        parentNode && parentNode.insertBefore(node, this);
        return node;
    },
    
    appendAfter(this: Node, node: Node): Node {
        const {nextSibling} = this;
        nextSibling && nextSibling.appendBefore(node);
        return node;
    },
    
});

Object.defineImmutableProperties(Element.prototype, {
    
    clearHTML(this: Element) {
        this.innerHTML = "";
    },
    
    setAttributes(this: Element, attributes: {[name: string]: any}) {
        for (const [attribute, value] of Object.entries(attributes)) {
            if (value) {
                this.setAttribute(attribute, value.toString());
            }
        }
    },
    
});

Object.defineImmutableProperties(HTMLElement.prototype, {
    
    appendTo<T extends HTMLElement>(this: T, parent: HTMLElement): T {
        parent.appendChild(this);
        return this;
    },
    
    appendNewElement(this: HTMLElement, tagName: string): HTMLElement {
        return this.appendChild(document.createElement(tagName));
    },
    
    appendDiv(this: HTMLElement): HTMLDivElement {
        return this.appendNewElement("div");
    },
    
    appendButton(this: HTMLElement, buttonText: string): HTMLButtonElement {
        const button = this.appendNewElement("button");
        button.innerText = buttonText;
        return button;
    },
    
    appendBr(this: HTMLElement): HTMLBRElement {
        return this.appendNewElement("br");
    },
    
    withInnerText<T extends HTMLElement>(this: T, text: string): T {
        this.innerText = text;
        return this;
    },
    
    withInnerHTML<T extends HTMLElement>(this: T, html: string): T {
        this.innerHTML = html;
        return this;
    },
    
});

Object.defineImmutableProperties(HTMLIFrameElement.prototype, {
    
    activate(this: HTMLIFrameElement): ActiveHTMLIFrameElement {
        this.appendTo(document.body);
        return this as ActiveHTMLIFrameElement;
    },
    
});

export const addExtensions = function(): void {

};