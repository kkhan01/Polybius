"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const isType_1 = require("../types/isType");
const Hash_1 = require("./Hash");
const webCrypto = window.crypto.subtle;
exports.hasCrypto = !!webCrypto;
if (!exports.hasCrypto) {
    console.info("crypto.subtle not available b/c using HTTP, Node crypto polyfill being used");
}
const makeShaWebCrypto = function (numBits) {
    const digest = exports.hasCrypto && webCrypto.digest.bind(webCrypto, { name: "Sha-" + numBits });
    return {
        async hash(data) {
            if (!exports.hasCrypto) {
                return Hash_1.stringBufferToString(data);
            }
            const buffer = Hash_1.stringBufferToBuffer(data);
            const hashBuffer = await digest(buffer);
            const hashArray = [...new Uint8Array(hashBuffer)];
            return hashArray.map(b => ("00" + b.toString(16)).slice(-2)).join("");
        },
    }.freeze();
};
const makeShaNodeCrypto = function (numBits) {
    return {
        hash(data) {
            const hash = crypto_1.createHash(`sha${numBits}`);
            const dataViewOrString = isType_1.isString(data)
                ? data
                : isType_1.isDataView(data)
                    ? data
                    : new DataView(isType_1.isArrayBuffer(data) ? data : data.buffer);
            hash.update(dataViewOrString);
            return Promise.resolve(hash.digest("hex"));
        }
    }.freeze();
};
const makeSha = exports.hasCrypto ? makeShaWebCrypto : makeShaNodeCrypto;
exports.Sha = [1, 256, 384, 512]
    .reduce((obj, numBits) => ({ ...obj, ["_" + numBits]: makeSha(numBits) }), {})
    .freeze();
//# sourceMappingURL=Sha.js.map