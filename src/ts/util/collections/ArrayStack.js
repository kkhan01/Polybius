"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bind_1 = require("../decorators/bind");
const Collection_1 = require("./Collection");
const HashEquals_1 = require("./HashEquals");
exports.ArrayStack = {
    new({ elements = [], hashEquals = HashEquals_1.HashEquals.default() }) {
        const { equals } = hashEquals;
        const a = bind_1.bind([...elements]);
        const { size, push, pop, last: peek, clear, remove } = a;
        // noinspection TypeScriptValidateJSTypes
        return Collection_1.Collection.basedOn({
            size,
            add: e => (push(e), true),
            remove: Collection_1.checkSizeChanged(size, (e) => remove(e, equals)),
            clear,
            [Symbol.iterator]: () => a[Symbol.iterator](),
            push,
            peek,
            pop,
        }, hashEquals, exports.ArrayStack.new);
    },
};
//# sourceMappingURL=ArrayStack.js.map