"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("../cache");
const utils_1 = require("../functional/utils");
const fnv1a_1 = require("../hash/fnv1a");
const isType_1 = require("../types/isType");
exports.Equals = {
    bind: (equals, t) => {
        return _t => equals(t, _t);
    },
    default: cache_1.getter((t1, t2) => exports.Equals.referential()(t1, t2) || exports.Hash.default()(t1) === exports.Hash.default()(t2)),
    referential: () => Object.is,
    fastEquals: (equals) => (t1, t2) => t1 === t2 && equals(t1, t2),
};
exports.Hash = {
    makeNumber(hash) {
        return isType_1.isNumber(hash) ? hash : fnv1a_1.fnv1a(isType_1.isString(hash) ? hash : exports.Hash.default()(hash));
    },
    // TODO maybe fix type assertion
    default: () => JSON.stringify,
    referential: () => utils_1.identity,
};
const defaultHashEquals = {
    hash: exports.Hash.referential(),
    equals: exports.Equals.referential(),
};
// can't properly type generic constant
// (only functions can be generic, but won't return same value each time)
const referentialHashEquals = {
    hash: exports.Hash.referential(),
    equals: exports.Equals.referential(),
};
exports.HashEquals = {
    default: () => defaultHashEquals,
    referential: () => referentialHashEquals,
    isReferential: hashEquals => hashEquals === referentialHashEquals,
    fastEquals: ({ hash, equals }) => ({ hash, equals: exports.Equals.fastEquals(equals) }),
};
//# sourceMappingURL=HashEquals.js.map