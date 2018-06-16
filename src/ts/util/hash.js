"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const utils_1 = require("../../share/util/utils");
const webCrypto = window.crypto.subtle;
exports.hasCrypto = !!webCrypto;
if (!exports.hasCrypto) {
    console.info("crypto.subtle not available b/c using HTTP, Node crypto polyfill being used");
}
const toBuffer = function (data) {
    if (utils_1.isString(data)) {
        return new TextEncoder().encode(data);
    }
    return data;
};
const toString = function (data) {
    if (utils_1.isString(data)) {
        return data;
    }
    return new TextDecoder().decode(data);
};
const makeShaWebCrypto = function (numBits) {
    const digest = exports.hasCrypto && webCrypto.digest.bind(webCrypto, { name: "SHA-" + numBits });
    return {
        async hash(data) {
            if (!exports.hasCrypto) {
                return toString(data);
            }
            const buffer = toBuffer(data);
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
            const dataViewOrString = utils_1.isString(data)
                ? data
                : utils_1.isDataView(data)
                    ? data
                    : new DataView(utils_1.isArrayBuffer(data) ? data : data.buffer);
            hash.update(dataViewOrString);
            return Promise.resolve(hash.digest("hex"));
        }
    }.freeze();
};
const makeSha = exports.hasCrypto ? makeShaWebCrypto : makeShaNodeCrypto;
exports.SHA = [1, 256, 384, 512]
    .reduce((obj, numBits) => ({ ...obj, ["_" + numBits]: makeSha(numBits) }), {})
    .freeze();
//# sourceMappingURL=hash.js.map