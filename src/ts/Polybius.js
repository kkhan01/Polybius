"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DownloadRouter_1 = require("./polybius/DownloadRouter");
const Options_1 = require("./polybius/Options");
const allExtensions_1 = require("./util/extensions/allExtensions");
const main = function () {
    allExtensions_1.addExtensions();
    // loadExample();
    DownloadRouter_1.f();
    Options_1.reactMain();
};
main();
//# sourceMappingURL=Polybius.js.map