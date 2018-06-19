export const greedyAsyncIterable = async function* <T>(delegate: Iterable<Promise<T>>): AsyncIterable<T> {
    const promises: Promise<T>[] = [];
    const iterator: Iterator<Promise<T>> = delegate[Symbol.iterator]();
    do {
        const {done, value} = iterator.next();
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
    const a: Promise<string>[] = [""].map(url => fetch(url).then(response => response.text()));
    greedyAsyncIterable(a);
    for await (const e of greedyAsyncIterable(a)) {
    
    }
})();