"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = function (o) {
    return Object.prototype.toString.call(o) === "[object String]";
};
exports.isDataView = function (o) {
    return o.constructor === DataView;
};
exports.isArrayBuffer = function (o) {
    return o.constructor === ArrayBuffer;
};
exports.capitalize = function (word) {
    return word.length === 0
        ? ""
        : word[0].toUpperCase() + word.slice(1);
};
exports.joinWords = function (words) {
    const _words = [...words];
    switch (_words.length) {
        case 0:
            return "";
        case 1:
            return _words[0];
        case 2:
            return _words[0] + " and " + _words[1];
        default:
            const lastWord = _words.pop();
            return _words.join(", ") + ", and " + lastWord;
    }
};
exports.separateClassName = function (className) {
    return className.replace(/([A-Z])/g, " $1").trim();
};
exports.separateFunctionName = function (functionName) {
    const [first, ...rest] = exports.separateClassName(functionName).split(" ");
    return [exports.capitalize(first), ...rest].join(" ");
};
exports.joinNodes = function (nodes, node) {
    if (nodes.length < 2) {
        return nodes;
    }
    const joinedNodes = [];
    for (let i = 0, j = 0; i < nodes.length; i++) {
        joinedNodes.push(nodes[i]);
        joinedNodes.push(node && node._clone());
    }
    joinedNodes.pop();
    return joinedNodes;
};
exports.singletonAsArray = function (singletonOrArray) {
    return Array.isArray(singletonOrArray) ? singletonOrArray : [singletonOrArray];
};
exports.filterInput = function (input, charFilter) {
    input.value = input.value.split("").filter(charFilter).join("");
};
/**
 * Check if a single character string is a allowDigits.
 *
 * @param {string} char a single character string
 * @returns {boolean} if the character is a allowDigits 0-9
 */
exports.isDigit = function (char) {
    return !Number.isNaN(parseInt(char));
};
exports.onlyDigitsInput = function (input) {
    exports.filterInput(input, exports.isDigit);
};
exports.sleep = function (seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};
const regExpLiteralPattern = /\/([^\/]+)\/([gimuy]*)/;
exports.isRegExpLiteral = function (regex) {
    return regExpLiteralPattern.test(regex);
};
exports.parseRegExpLiteral = function (regex) {
    const match = regExpLiteralPattern.exec(regex);
    if (match) {
        const [, pattern, flags] = match;
        return new RegExp(pattern, flags);
    }
    else {
        return undefined;
    }
};
exports.escapeRegExp = function (literal, flags) {
    return new RegExp(literal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), flags);
};
//# sourceMappingURL=utils.js.map