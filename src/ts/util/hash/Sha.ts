import {createHash} from "crypto";
import {isArrayBuffer, isDataView, isString} from "../types/isType";
import {Buffer, Hash, stringBufferToBuffer, stringBufferToString} from "./Hash";

const webCrypto: SubtleCrypto = window.crypto.subtle;

export const hasCrypto: boolean = !!webCrypto;
if (!hasCrypto) {
    console.info("crypto.subtle not available b/c using HTTP, Node crypto polyfill being used");
}

interface MakeSha {
    
    (numBits: number): Hash;
    
}

const makeShaWebCrypto: MakeSha = function(numBits: number): Hash {
    const digest: (buffer: Buffer) => Promise<ArrayBuffer> =
        hasCrypto && webCrypto.digest.bind(webCrypto, {name: "Sha-" + numBits});
    
    return {
        async hash(data: string | Buffer): Promise<string> {
            if (!hasCrypto) {
                return stringBufferToString(data);
            }
            const buffer: Buffer = stringBufferToBuffer(data);
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

export interface Sha {
    
    _1: Hash;
    
    _256: Hash;
    
    _384: Hash;
    
    _512: Hash;
    
}

export const Sha: Sha = <Sha> [1, 256, 384, 512]
    .reduce((obj: any, numBits: number) => ({...obj, ["_" + numBits]: makeSha(numBits)}), {})
    .freeze();