import {capitalize} from "../utils";

export interface NativeTypes {
    
    null: null;
    undefined: undefined;
    boolean: boolean;
    number: number;
    string: string;
    Function: Function;
    Array: Array<any>;
    RegExp: RegExp;
    Date: Date;
    object: object;
    
}

export type Is<T> = (o: any) => o is T;

export const isNativeType = function <T extends keyof NativeTypes>(type: T): Is<NativeTypes[T]> {
    const typeName: string = `[object ${capitalize(type)}]`;
    const toString = Object.prototype.toString;
    return (o: any): o is NativeTypes[T] => toString.call(o) === typeName;
};

// can use isNativeType for all, but some can be optimized
export const isNull: Is<null> = (o: any): o is null => o === null;
export const isUndefined: Is<undefined> = (o: any): o is undefined => o === undefined;
export const isBoolean: Is<boolean> = (o: any): o is boolean => o === true || o === false;
export const isNumber = isNativeType("number");
export const isString = isNativeType("string");
export const isFunction = isNativeType("Function"); // TODO can this be optimized?
export const isArray = Array.isArray;
export const isRegExp = isNativeType("RegExp");
export const isDate = isNativeType("Date");
export const isObject = isNativeType("object");

export const isByConstructor = function <T>(constructor: new (...args: any[]) => T): Is<T> {
    return (o: any): o is T => o.constructor === constructor;
};

export const isDataView = isByConstructor(DataView);
export const isArrayBuffer = isByConstructor(ArrayBuffer);
