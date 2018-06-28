export const truthy = function <T>(value: OrFalsy<T>): value is T {
    return !!value;
};