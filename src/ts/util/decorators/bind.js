"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyWindow_1 = require("../anyWindow");
const allExtensions_1 = require("../extensions/allExtensions");
allExtensions_1.addExtensions();
exports.bind = function (target) {
    if (typeof target !== "object") {
        throw new Error(`cannot bind non-object: ${target}`);
    }
    const _target = target;
    const isBindable = (value) => value.bind && !value.bound; // don't double bind methods
    const bind = (f) => {
        f = f.bind(_target);
        f.bound = true;
        return f;
    };
    const properties = Object.getAllPropertyNames(target)
        .map(key => ({ key, value: _target[key] }))
        .filter(({ value }) => isBindable(value))
        .map(({ key, value }) => [key, bind(value)])
        .toObject();
    Object.defineImmutableProperties(target, properties);
    return target;
};
anyWindow_1.globals({ bind: exports.bind });
exports.bindClass = function (Target) {
    return class extends Target {
        // noinspection JSUnusedGlobalSymbols
        constructor(...args) {
            super(...args);
            exports.bind(this);
        }
    };
};
//# sourceMappingURL=bind.js.map