"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyWindow = window;
exports.globals = function (o) {
    Object.assign(exports.anyWindow, o);
};
exports.globals({ globals: exports.globals });
//# sourceMappingURL=anyWindow.js.map