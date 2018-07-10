import {Mapper} from "./functional/Mapper";

export namespace iterables {
    
    export const ofGenerator = function<T>(generator: () => Iterator<T>) {
        return {
            [Symbol.iterator]: generator,
        };
    };
    
    export const ofIterator = function<T>(iterator: Iterator<T>): Iterable<T> {
        return ofGenerator(() => iterator);
    };
    
    export const map = function<T, U>(iterable: Iterable<T>, map: Mapper<T, U>): Iterable<U> {
        return ofGenerator(function*() {
            let i = 0;
            for (const e of iterable) {
                yield map(e, i++);
            }
        });
    };
    
}