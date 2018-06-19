"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greedyAsyncIterable = async function* (delegate) {
    const promises = [];
    const iterator = delegate[Symbol.iterator]();
    do {
        const { done, value } = iterator.next();
        if (done) {
            break;
        }
        promises.push(value);
    } while (true);
    // resolve all promises before yielding them so they are resolved concurrently
    for (const promise of promises) {
        yield promise;
    }
};
(async () => {
    const a = [""].map(url => fetch(url).then(response => response.text()));
    exports.greedyAsyncIterable(a);
    for await (const e of exports.greedyAsyncIterable(a)) {
    }
})();
//# sourceMappingURL=greedyAsyncIterable.js.map