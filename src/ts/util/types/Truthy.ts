export type Truthy<T> = T extends false | 0 | null | undefined | "" ? never : T;

export type OrFalsy<T> = T | false | 0 | null | undefined | "";

export const truthy = function <T>(value: OrFalsy<T>): value is T {
    return !!value;
};