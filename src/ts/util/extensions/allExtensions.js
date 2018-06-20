"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutableDescriptor = Object.freeze({
    writable: false,
    enumerable: false,
    configurable: true,
});
const defineSharedProperties = function (obj, sharedDescriptor, propertyValues, overwrite = true) {
    const properties = Object.getOwnPropertyDescriptors(propertyValues);
    Object.entries(properties).forEach(([propertyName, property]) => {
        if (!overwrite && obj[propertyName]) {
            return;
        }
        property = { ...property, ...sharedDescriptor };
        if (property.get || property.set) {
            delete property.writable;
        }
        properties[propertyName] = property;
    });
    Object.defineProperties(obj, properties);
};
defineSharedProperties(Object, immutableDescriptor, {
    defineSharedProperties,
    defineImmutableProperties(obj, propertyValues, overwrite = true) {
        defineSharedProperties(obj, immutableDescriptor, propertyValues, overwrite);
    },
});
Object.defineImmutableProperties(Object, {
    definePolyfillProperties(obj, propertyValues) {
        Object.defineImmutableProperties(obj, propertyValues, false);
    },
    getPrototypeChain(object) {
        const chain = [];
        for (let o = object; o !== null; o = Object.getPrototypeOf(o)) {
            chain.push(o);
        }
        return chain;
    },
    getAllPropertyNames(object) {
        return Array.from(new Set(Object.getPrototypeChain(object)
            .flatMap(Object.getOwnPropertyNames)));
    },
    getting(key) {
        return o => o[key];
    },
    deleting(key) {
        return o => {
            delete o[key];
            return o;
        };
    },
});
Object.defineImmutableProperties(Object.prototype, {
    freeze() {
        return Object.freeze(this);
    },
    seal() {
        return Object.seal(this);
    },
    _clone() {
        return Object.assign(Object.create(null), this);
    },
    fullClone() {
        return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    },
    mapFields(mapper) {
        const obj = Object.create(null);
        for (const [key, value] of Object.entries(this)) {
            obj[key] = mapper(value);
        }
        return obj;
    },
    freezeFields() {
        for (const value of Object.values(this)) {
            value.freeze();
        }
        return this;
    }
});
Object.defineImmutableProperties(Function, {
    compose(...funcs) {
        const numFuncs = funcs.length;
        if (numFuncs === 0) {
            return () => undefined;
        }
        const [firstFunc, ...restFunc] = funcs;
        if (numFuncs === 1) {
            return firstFunc();
        }
        return function (...args) {
            let result = firstFunc();
            for (const func of funcs) {
                result = func(result);
            }
            return result;
        };
    },
});
Object.defineImmutableProperties(Function.prototype, {
    then(nextFunc) {
        return (arg) => nextFunc(this(arg));
    },
    applyReturning() {
        return (arg) => {
            this(arg);
            return arg;
        };
    },
    mapping() {
        return array => array.map(this);
    },
    applying() {
        return array => this(...array);
    },
    timed() {
        const timer = (...args) => {
            const { name } = this;
            console.time(name);
            const returnValue = this(...args);
            console.timeEnd(name);
            return returnValue;
        };
        return timer.named("timing_" + this.name);
    },
    setName(name) {
        Object.defineProperties(this, {
            name: {
                value: name,
            },
        });
    },
    named(name) {
        this.setName(name);
        return this;
    },
    negate() {
        return ((...args) => !this(...args));
    },
});
Object.defineImmutableProperties(Array.prototype, {
    last() {
        return this[this.length - 1];
    },
    clear() {
        this.length = 0;
    },
    removeAt(index) {
        return this.splice(index, 1)[0];
    },
    remove(value) {
        const i = this.indexOf(value);
        if (i !== -1) {
            return this.removeAt(i);
        }
    },
    add(index, value) {
        this.splice(index, 0, value);
    },
    addAll(values, index = this.length) {
        if (index === this.length) {
            this.push(...values);
        }
        else {
            this.splice(index, 0, ...values);
        }
    },
    applyOn(func) {
        return func(this);
    },
    callOn(func) {
        return func(...this);
    },
    toObject() {
        let o = Object.create(null);
        for (const [k, v] of this) {
            o[k] = v;
        }
        return o;
    },
    sortBy(key) {
        this.sort((a, b) => key(a) - key(b));
        return this;
    },
    random() {
        return this[Math.floor(Math.random() * this.length)];
    },
    mapCall() {
        return this.map(f => f());
    },
    callEach() {
        this.forEach(f => f());
    },
});
Object.definePolyfillProperties(Array.prototype, {
    flatMap(flatMap, thisArg) {
        if (thisArg) {
            flatMap = flatMap.bind(thisArg);
        }
        return [].concat(...this.map(flatMap));
    },
    flatten(depth = -1) {
        return depth === 0
            ? this
            : this.reduce((a, e) => a.concat(Array.isArray(e) ? e.flatten(depth - 1) : e), []);
    },
});
const nativeSlice = String.prototype.slice;
Object.defineImmutableProperties(String.prototype, {
    equals(s) {
        return this === s;
    },
    boundEquals() {
        return s => this === s;
    },
    // allow negative indices for end
    slice(start = 0, end = this.length) {
        if (end < 0) {
            end = this.length + end;
        }
        return nativeSlice.call(this, start, end);
    },
});
Object.defineImmutableProperties(Number, {
    isNumber(n) {
        return !Number.isNaN(n);
    },
    toPixels(n) {
        return Math.round(n) + "px";
    },
});
Object.defineImmutableProperties(RegExp.prototype, {
    boundTest() {
        return s => this.test(s);
    },
    boundExec() {
        return s => this.exec(s);
    },
    toSource() {
        const { source, flags } = this;
        return `/${source}/${flags}`;
    },
});
Object.defineImmutableProperties(Node.prototype, {
    appendBefore(node) {
        const { parentNode } = this;
        parentNode && parentNode.insertBefore(node, this);
        return node;
    },
    appendAfter(node) {
        const { nextSibling } = this;
        nextSibling && nextSibling.appendBefore(node);
        return node;
    },
});
Object.defineImmutableProperties(Element.prototype, {
    clearHTML() {
        this.innerHTML = "";
    },
    setAttributes(attributes) {
        for (const [attribute, value] of Object.entries(attributes)) {
            if (value) {
                this.setAttribute(attribute, value.toString());
            }
        }
    },
});
Object.defineImmutableProperties(HTMLElement.prototype, {
    appendTo(parent) {
        parent.appendChild(this);
        return this;
    },
    appendNewElement(tagName) {
        return this.appendChild(document.createElement(tagName));
    },
    appendDiv() {
        return this.appendNewElement("div");
    },
    appendButton(buttonText) {
        const button = this.appendNewElement("button");
        button.innerText = buttonText;
        return button;
    },
    appendBr() {
        return this.appendNewElement("br");
    },
    withInnerText(text) {
        this.innerText = text;
        return this;
    },
    withInnerHTML(html) {
        this.innerHTML = html;
        return this;
    },
});
exports.addExtensions = function () {
};
//# sourceMappingURL=allExtensions.js.map