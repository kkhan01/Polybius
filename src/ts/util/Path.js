"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("./polyfills/path");
exports.Path = {
    of(path) {
        const { root, dir, base, name, ext } = path_1.path.parse(path);
        return {
            path: path,
            fullFilename: base,
            filename: name,
            extension: ext.slice(1),
            append: (newPath) => exports.Path.of(path_1.path.resolve(path, newPath.toString())),
            absolute: () => exports.Path.of(path_1.path.resolve(path)),
            toString: () => path,
        };
    },
};
//# sourceMappingURL=Path.js.map