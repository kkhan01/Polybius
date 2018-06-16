import {ReactNode} from "react";

export const isString = function(o: any): o is string {
    return Object.prototype.toString.call(o) === "[object String]";
};

export const isDataView = function(o: any): o is DataView {
    return o.constructor === DataView;
};

export const isArrayBuffer = function(o: any): o is ArrayBuffer {
    return o.constructor === ArrayBuffer;
};

export const capitalize = function(word: string): string {
    return word.length === 0
        ? ""
        : word[0].toUpperCase() + word.slice(1);
};

export const joinWords = function(words: ReadonlyArray<string>): string {
    const _words: string[] = [...words];
    switch (_words.length) {
        case 0:
            return "";
        case 1:
            return _words[0];
        case 2:
            return _words[0] + " and " + _words[1];
        default:
            const lastWord: string = _words.pop() as string;
            return _words.join(", ") + ", and " + lastWord;
    }
};

export const separateClassName = function(className: string): string {
    return className.replace(/([A-Z])/g, " $1").trim();
};

export const joinNodes = function(nodes: ReactNode[], node: ReactNode): ReactNode[] {
    if (nodes.length < 2) {
        return nodes;
    }
    const joinedNodes: ReactNode[] = [];
    for (let i = 0, j = 0; i < nodes.length; i++) {
        joinedNodes.push(nodes[i]);
        joinedNodes.push(node && node._clone());
    }
    joinedNodes.pop();
    return joinedNodes;
};

export const singletonAsArray = function <T>(singletonOrArray: T | T[]) {
    return Array.isArray(singletonOrArray) ? singletonOrArray : [singletonOrArray];
};

export const filterInput = function(input: HTMLInputElement, charFilter: (c: string) => boolean): void {
    input.value = input.value.split("").filter(charFilter).join("");
};

/**
 * Check if a single character string is a allowDigits.
 *
 * @param {string} char a single character string
 * @returns {boolean} if the character is a allowDigits 0-9
 */
export const isDigit = function(char: string): boolean {
    return !Number.isNaN(parseInt(char));
};

export const onlyDigitsInput = function(input: HTMLInputElement): void {
    filterInput(input, isDigit);
};

export const sleep = function(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};