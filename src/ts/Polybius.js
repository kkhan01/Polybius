"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chrome_promise_1 = require("chrome-promise");
const example_1 = require("./example");
const allExtensions_1 = require("./util/extensions/allExtensions");
const main = function () {
    allExtensions_1.addExtensions();
    example_1.loadExample();
    (async () => {
        const fs = await chrome_promise_1.default.fileSystemProvider.mount({
            fileSystemId: "",
            displayName: "",
        });
    })();
};
main();
//# sourceMappingURL=Polybius.js.map