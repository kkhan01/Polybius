"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodePath = require("path");
const allExtensions_1 = require("../extensions/allExtensions");
const pathBrowserify = require("path-browserify");
allExtensions_1.addExtensions();
exports.path = nodePath;
const oldNodePath = exports.path.fullClone();
// add any missing properties in webpack's path polyfill
// with the complete path-browserify polyfill
// (even though they're supposed to be the same, they're not (path.parse is missing))
Object.defineProperties(nodePath, Object.getOwnPropertyDescriptors(pathBrowserify));
Object.defineProperties(nodePath, Object.getOwnPropertyDescriptors(oldNodePath));
//# sourceMappingURL=path.js.map