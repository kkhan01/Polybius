"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SandboxMessenger_1 = require("../util/sandbox/SandboxMessenger");
const utils_1 = require("../util/utils");
exports.Test = {
    number: async (rule) => {
        const { input } = rule;
        const value = parseInt(input);
        if (isNaN(value)) {
            throw new Error(`Invalid Int: ${input}`);
        }
        return {
            rule: {
                type: "number",
                ...rule,
            },
            test: async (n) => value === n,
        };
    },
    string: async (rule) => {
        const { input } = rule;
        return {
            rule: {
                type: "string",
                ...rule,
            },
            test: async (s) => input === s,
        };
    },
    regex: async (rule) => {
        const { input } = rule;
        const regex = utils_1.parseRegExpLiteral(input);
        if (!regex) {
            throw new Error(`Invalid RegExp: ${input}`);
        }
        return {
            rule: {
                type: "regex",
                ...rule,
            },
            test: async (s) => regex.test(s),
        };
    },
    function: async (rule) => {
        const { input } = rule;
        const func = await (await SandboxMessenger_1.sandbox).compile(input);
        return {
            rule: {
                type: "function",
                ...rule,
            },
            test: func,
        };
    },
};
exports.deserializeTest = (rule) => exports.Test[rule.type](rule);
//# sourceMappingURL=Test.js.map