"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allExtensions_1 = require("../extensions/allExtensions");
allExtensions_1.addExtensions();
// a shared global object accessible by all sandboxed functions
// this allows them to share code
const sandboxGlobal = Object.create(null);
let nextFunctionId = 0;
const functions = new Map();
const onMessage = function (event) {
    const { source, data } = event;
    if (!source) {
        return;
    }
    const { id, type, message } = data;
    if (id === null || id === undefined) {
        return; // w/o an id, can't even signal an error
    }
    const postMessage = function (message) {
        source.postMessage({ id, message }, "*" || location.origin);
    };
    const postError = function (message) {
        postMessage({ error: message, value: undefined });
    };
    const invokers = {
        call(thisArg, ...args) {
            return this.call(thisArg, ...args);
        },
        bind(thisArg, ...args) {
            const boundFunc = this.bind(thisArg, ...args);
            const id = nextFunctionId++;
            functions.set(id, boundFunc);
            return id;
        },
    };
    const responders = {
        evaluate(js) {
            const wrappedFunc = new Function("global", `"use strict"; return (${js})`);
            return wrappedFunc(sandboxGlobal);
        },
        compile(js) {
            const func = responders.evaluate(js);
            const id = nextFunctionId++;
            functions.set(id, func);
            return id;
        },
        invoke(invokeArgs) {
            const { type, id, thisArg, args } = invokeArgs;
            if (!(type in invokers)) {
                postError(`Invalid InvokeType: ${type}`);
                return;
            }
            const func = functions.get(id);
            if (!func) {
                postError(`Invalid FunctionId: ${id}`);
                return;
            }
            return invokers[type].call(func, thisArg, ...args);
        },
    };
    if (!(type in responders)) {
        postError(`Invalid MessageType: ${type}`);
    }
    const postValue = function (value) {
        postMessage({ value });
    };
    try {
        postValue(responders[type](message));
    }
    catch (e) {
        if (e instanceof Error) {
            e = `${e.name}: ${e.message}`;
        }
        postError(e);
    }
};
exports.initSandbox = function () {
    addEventListener("message", onMessage, false);
};
//# sourceMappingURL=Sandbox.js.map