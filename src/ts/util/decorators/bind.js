"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allExtensions_1 = require("../extensions/allExtensions");
allExtensions_1.addExtensions();
exports.bind = function (target) {
    const _target = target;
    const isBindable = (value) => value.bind && !value.bound; // don't double bind methods
    const bind = (f) => {
        f = f.bind(_target);
        f.bound = true;
        return f;
    };
    Object.defineImmutableProperties(target, Object.getAllPropertyNames(target)
        .map(key => ({ key, value: _target[key] }))
        .filter(({ value }) => isBindable(value))
        .map(({ key, value }) => [key, bind(value)])
        .toObject());
    return target;
};
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