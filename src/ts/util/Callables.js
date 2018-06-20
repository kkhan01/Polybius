"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bind_1 = require("./decorators/bind");
exports.Callables = {
    new() {
        const { push: add, callEach: _call } = bind_1.bind([]);
        const call = _call;
        return { add, call };
    },
};
//# sourceMappingURL=Callables.js.map