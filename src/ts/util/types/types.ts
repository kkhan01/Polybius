import {PropagateWellKnownSymbols, WellKnownSymbolKeyOf} from "./WellKnownSymbols";


export type StringKeyOf<T> = Extract<keyof T, string>;

/**
 * WellKnownSymbols are not included in keyof,
 * a bug in the TypeScript compiler.
 * It should be fixed in TypeScript 3.0.
 */
export type KeyOf<T> = keyof T | WellKnownSymbolKeyOf<T>;

/**
 * U \ T
 */
export type Difference<T, U> = {[K in Exclude<keyof U, keyof T>]: U[K]} & PropagateWellKnownSymbols<U>;

/**
 * U \ T & Partial<T>
 */
export type PartialDifference<T, U> = Difference<T, U> & Partial<T>;


// const s: symbol = Symbol.iterator;
//
//
// type X = {
//     x: number;
//     y: number;
//     [Symbol.iterator](): Iterator<number>;
//     // [Symbol.toStringTag]: "";
// }
//
// const a: KeyOf<X> = Symbol.match;
//
// type Y = {
//     y: number;
// }
//
// type XY = PartialDifference<Y, X>;
// const xy: XY = {x: 1, [Symbol.iterator]: () => [1][Symbol.iterator]()};
// // const x: X = Object.assign(xy, {y: 1});