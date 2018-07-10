"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyWindow_1 = require("../anyWindow");
const allExtensions_1 = require("../extensions/allExtensions");
allExtensions_1.addExtensions();
const createIframeSandbox = function (src) {
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.hidden = true;
    const activatedIframe = iframe.activate();
    return new Promise(resolve => {
        iframe.onload = () => {
            resolve(activatedIframe);
        };
    });
};
exports.SandboxMessenger = {
    async new(src) {
        const iframe = await createIframeSandbox(src);
        anyWindow_1.globals({ iframe });
        const window = iframe.contentWindow;
        let nextId = 0;
        const promises = new Map();
        const postMessage = function (type, message) {
            const id = nextId++;
            const typedMessage = { id, type, message };
            window.postMessage(typedMessage, "*" || location.origin);
            return new Promise((resolve, reject) => {
                promises.set(id, { resolve, reject });
            });
        };
        const onMessage = function (event) {
            const { id, message: { value, error } } = event.data;
            const pendingPromise = promises.get(id);
            if (pendingPromise) {
                const { resolve, reject } = pendingPromise;
                if (error) {
                    reject(error);
                }
                resolve(value);
            }
        };
        addEventListener("message", onMessage, false);
        const postFunctionMessage = function (args) {
            return postMessage("invoke", args);
        };
        const newSandboxedFunction = function (id) {
            const invokeArgs = function (type, thisArg, args) {
                return { type, id, thisArg, args };
            };
            const f = function (...args) {
                return postFunctionMessage(invokeArgs("call", this, args));
            };
            // override Function.bind() b/c it's more efficient to bind on the sandbox side
            f.bind = async function (thisArg, ...args) {
                const id = await postFunctionMessage(invokeArgs("bind", args, thisArg));
                return newSandboxedFunction(id);
            };
            return f;
        };
        const evaluate = function (js) {
            return postMessage("evaluate", js);
        };
        const compile = async function (js) {
            const id = await postMessage("compile", js);
            return newSandboxedFunction(id);
        };
        return {
            compile,
            evaluate,
        };
    },
};
exports.sandboxMain = async function () {
    const sandbox = await exports.SandboxMessenger.new("sandbox.html");
    anyWindow_1.globals({ sandbox });
    console.log(sandbox);
    const f = await sandbox.compile("(a, b) => a + b");
    console.log(f);
    const y = await f(2, 3);
    console.log(y);
};
exports.sandbox = exports.SandboxMessenger.new("sandbox.html");
//# sourceMappingURL=SandboxMessenger.js.map