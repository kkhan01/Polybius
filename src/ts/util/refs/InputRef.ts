import {createNotNullRef, NotNullRef} from "./NotNullRef";

interface MutableInputRef {
    
    (): string;
    
    ref: NotNullRef<HTMLInputElement>;
    
}

export interface InputRef {
    
    (): string;
    
    readonly ref: NotNullRef<HTMLInputElement>;
    
}

export const InputRef = {
    
    new(): InputRef {
        const inputRef: NotNullRef<HTMLInputElement> = createNotNullRef();
        const getValue: MutableInputRef = <MutableInputRef> function(): string {
            return inputRef.current.value;
        };
        getValue.ref = inputRef;
        return getValue.freeze();
    },
    
}.freeze();