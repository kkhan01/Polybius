"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamicFunction = function (functionBody) {
    const test = new Function("download", functionBody);
    const returnValue = test("test.pdf"); // to catch errors
    if (typeof returnValue !== "boolean") {
        throw new Error("Return value of custom filter function must be a boolean: " + test);
    }
    return test;
};
//# sourceMappingURL=dynamicFunction.js.map