import {isString} from "../types/isType";

export type TypedArray =
    Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Uint8ClampedArray
    | Float32Array
    | Float64Array;

export type Buffer = TypedArray | ArrayBuffer | DataView;

export const stringBufferToBuffer = function(data: string | Buffer): Buffer {
    if (isString(data)) {
        return new TextEncoder().encode(data);
    }
    return data;
};

export const stringBufferToString = function(data: string | Buffer): string {
    if (isString(data)) {
        return data;
    }
    return new TextDecoder().decode(data);
};

export interface Hash {
    
    hash(data: string): Promise<string>;
    
    hash(data: Buffer): Promise<string>;
    
}
