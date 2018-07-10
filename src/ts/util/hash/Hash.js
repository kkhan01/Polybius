"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isType_1 = require("../types/isType");
exports.stringBufferToBuffer = function (data) {
    if (isType_1.isString(data)) {
        return new TextEncoder().encode(data);
    }
    return data;
};
exports.stringBufferToString = function (data) {
    if (isType_1.isString(data)) {
        return data;
    }
    return new TextDecoder().decode(data);
};
//# sourceMappingURL=Hash.js.map