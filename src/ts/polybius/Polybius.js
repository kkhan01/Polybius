"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyWindow_1 = require("../util/anyWindow");
const ArrayStack_1 = require("../util/collections/ArrayStack");
const HashEquals_1 = require("../util/collections/HashEquals");
const allExtensions_1 = require("../util/extensions/allExtensions");
const SandboxMessenger_1 = require("../util/sandbox/SandboxMessenger");
const downloadListener_1 = require("./downloadListener");
const Rules_1 = require("./Rules");
const sampleRules_1 = require("./sampleRules");
const main = function () {
    allExtensions_1.addExtensions();
    // loadExample();
    sampleRules_1.addSampleRules();
    downloadListener_1.addDownloadListener();
    Rules_1.reactMain();
    SandboxMessenger_1.sandboxMain().then(); // TODO
    const stack = ArrayStack_1.ArrayStack.new({ hashEquals: HashEquals_1.HashEquals.referential() });
    stack.push(1);
    console.log(stack);
    console.log(stack.pop());
    const _stack = stack;
    _stack.forEach((e, i) => console.log(e, i));
    anyWindow_1.globals({ stack });
};
main();
//# sourceMappingURL=Polybius.js.map