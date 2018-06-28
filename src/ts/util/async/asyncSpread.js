"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncSpread = async function (delegate) {
    const a = [];
    for await (const t of delegate) {
        a.push(t);
    }
    return a;
};
//# sourceMappingURL=asyncSpread.js.map