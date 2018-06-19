import * as nodePath from "path";
import {addExtensions} from "../extensions/allExtensions";

const pathBrowserify = require("path-browserify");

addExtensions();

export const path: typeof nodePath = nodePath;

const oldNodePath: typeof path = path.fullClone();

// add any missing properties in webpack's path polyfill
// with the complete path-browserify polyfill
// (even though they're supposed to be the same, they're not (path.parse is missing))
Object.defineProperties(nodePath, Object.getOwnPropertyDescriptors(pathBrowserify));
Object.defineProperties(nodePath, Object.getOwnPropertyDescriptors(oldNodePath));
