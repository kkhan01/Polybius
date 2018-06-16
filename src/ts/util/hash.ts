import {createHash} from "crypto";
import {isArrayBuffer, isDataView, isString} from "../../share/util/utils";

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

const webCrypto: SubtleCrypto = window.crypto.subtle;

export const hasCrypto: boolean = !!webCrypto;
if (!hasCrypto) {
    console.info("crypto.subtle not available b/c using HTTP, Node crypto polyfill being used");
}

export type Buffer = TypedArray | ArrayBuffer | DataView;

const toBuffer = function(data: string | Buffer): Buffer {
    if (isString(data)) {
        return new TextEncoder().encode(data);
    }
    return data;
};

const toString = function(data: string | Buffer): string {
    if (isString(data)) {
        return data;
    }
    return new TextDecoder().decode(data);
};

interface MakeSha {
    
    (numBits: number): Hash;
    
}

const makeShaWebCrypto: MakeSha = function(numBits: number): Hash {
    const digest: (buffer: Buffer) => Promise<ArrayBuffer> =
        hasCrypto && webCrypto.digest.bind(webCrypto, {name: "SHA-" + numBits});
    
    return {
        async hash(data: string | Buffer): Promise<string> {
            if (!hasCrypto) {
                return toString(data);
            }
            const buffer: Buffer = toBuffer(data);
            const hashBuffer: ArrayBuffer = await digest(buffer);
            const hashArray: number[] = [...new Uint8Array(hashBuffer)];
            return hashArray.map(b => ("00" + b.toString(16)).slice(-2)).join("");
        },
    }.freeze();
};

const makeShaNodeCrypto: MakeSha = function(numBits: number): Hash {
    
    return {
        
        hash(data: string | Buffer): Promise<string> {
            const hash = createHash(`sha${numBits}`);
            const dataViewOrString = isString(data)
                ? data
                : isDataView(data)
                    ? data
                    : new DataView(isArrayBuffer(data) ? data : data.buffer as ArrayBuffer);
            hash.update(dataViewOrString);
            return Promise.resolve(hash.digest("hex"));
        }
        
    }.freeze();
    
};

const makeSha: MakeSha = hasCrypto ? makeShaWebCrypto : makeShaNodeCrypto;

export interface Hash {
    
    hash(data: string): Promise<string>;
    
    hash(data: Buffer): Promise<string>;
    
}

export interface Sha {
    
    _1: Hash;
    
    _256: Hash;
    
    _384: Hash;
    
    _512: Hash;
    
}

export const SHA: Sha = <Sha> [1, 256, 384, 512]
    .reduce((obj: any, numBits: number) => ({...obj, ["_" + numBits]: makeSha(numBits)}), {})
    .freeze();