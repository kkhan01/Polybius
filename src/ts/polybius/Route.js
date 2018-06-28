"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../util/Path");
const SandboxMessenger_1 = require("../util/sandbox/SandboxMessenger");
const defaultConflictAction = "uniquify";
exports.Route = {
    path: async (rule) => {
        const { input, conflictAction = defaultConflictAction } = rule;
        const path = Path_1.Path.of(input);
        return {
            rule: {
                type: "path",
                ...rule,
            },
            route: async (download) => ({
                path: path.append(Path_1.Path.of(download.filename)),
                conflictAction,
            }),
        };
    },
    function: async (rule) => {
        const { input, conflictAction: backupConflictAction = defaultConflictAction } = rule;
        const func = await (await SandboxMessenger_1.sandbox).compile(input);
        return {
            rule: {
                type: "function",
                ...rule,
            },
            route: async (download) => {
                const { path, conflictAction = backupConflictAction } = await func(download);
                return { path, conflictAction };
            },
        };
    },
};
exports.deserializeRoute = (rule) => exports.Route[rule.type](rule);
//# sourceMappingURL=Route.js.map