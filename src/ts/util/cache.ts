export const cache = function<T>(getter: () => T): () => T {
    let cache: T | null = null;
    return function(): T {
        return cache || (cache = getter());
    };
};

export const getter = function<T>(t: T): () => T {
    return () => t;
};