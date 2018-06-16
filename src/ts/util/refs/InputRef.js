"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotNullRef_1 = require("./NotNullRef");
exports.InputRef = {
    new() {
        const inputRef = NotNullRef_1.createNotNullRef();
        const getValue = function () {
            return inputRef.current.value;
        };
        getValue.ref = inputRef;
        return getValue.freeze();
    },
}.freeze();
//# sourceMappingURL=InputRef.js.map