export type HasIteratorSymbol<T> = Iterable<T>;

export type HasAsyncIteratorSymbol<T> = AsyncIterable<T>;

export interface HasHasInstanceSymbol {
    
    [Symbol.hasInstance](value: any): boolean;
    
}

export interface HasIsConcatSpreadableSymbol {
    
    [Symbol.isConcatSpreadable]: boolean;
    
}

export interface HasMatchSymbol {
    
    [Symbol.match](string: string): RegExpMatchArray | null;
    
}

export interface HasReplaceSymbol {
    
    [Symbol.replace](string: string, replaceValue: string): string;
    
    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
    
}

export interface HasSearchSymbol {
    
    [Symbol.search](string: string): number;
    
}

export interface HasSpeciesSymbol<T> {
    
    [Symbol.species]: {
        new(...args: any[]): T,
    }
    
}

export interface HasSplitSymbol {
    
    [Symbol.split](string: string, limit?: number): string[];
    
}

export interface ToPrimitiveHint {
    
    default: string;
    string: string;
    number: number;
    
}

export interface HasToPrimitiveSymbol {
    
    [Symbol.toPrimitive]<T extends keyof ToPrimitiveHint>(hint: T): ToPrimitiveHint[T];
    
}

export interface HasToStringTagSymbol {
    
    [Symbol.toStringTag]: string;
    
}

export interface HasUnscopablesSymbol {
    
    [Symbol.unscopables](): {[key: string]: boolean};
    
}


export interface WellKnownSymbols {
    
    iterator<T>(): HasIteratorSymbol<T>;
    
    asyncIterator<T>(): HasAsyncIteratorSymbol<T>;
    
    hasInstance(): HasHasInstanceSymbol;
    
    isConcatSpreadable(): HasIsConcatSpreadableSymbol;
    
    match(): HasMatchSymbol;
    
    replace(): HasReplaceSymbol;
    
    search(): HasSearchSymbol;
    
    species<T>(): HasSpeciesSymbol<T>;
    
    split(): HasSplitSymbol;
    
    toPrimitive(): HasToPrimitiveSymbol;
    
    toStringTag(): HasToStringTagSymbol;
    
    unscopables(): HasUnscopablesSymbol;
    
}

type HasWellKnownSymbol = ReturnType<WellKnownSymbols[keyof WellKnownSymbols]>;

type PropagateHasSymbol<HasSymbol extends HasWellKnownSymbol, T>
    = T extends HasSymbol ? HasSymbol : {};

export type PropagateWellKnownSymbols<T> = PropagateHasSymbol<HasIteratorSymbol<any>, T>
    & PropagateHasSymbol<HasAsyncIteratorSymbol<any>, T>
    & PropagateHasSymbol<HasHasInstanceSymbol, T>
    & PropagateHasSymbol<HasIsConcatSpreadableSymbol, T>
    & PropagateHasSymbol<HasMatchSymbol, T>
    & PropagateHasSymbol<HasReplaceSymbol, T>
    & PropagateHasSymbol<HasSearchSymbol, T>
    & PropagateHasSymbol<HasSpeciesSymbol<any>, T>
    & PropagateHasSymbol<HasSplitSymbol, T>
    & PropagateHasSymbol<HasToPrimitiveSymbol, T>
    & PropagateHasSymbol<HasToStringTagSymbol, T>
    & PropagateHasSymbol<HasUnscopablesSymbol, T>
    ;

type CheckSymbolKeyOf<SymbolName extends keyof WellKnownSymbols, T>
    = T extends ReturnType<WellKnownSymbols[SymbolName]> ? typeof Symbol[SymbolName] : never;

// TODO broken
export type WellKnownSymbolKeyOf<T> = CheckSymbolKeyOf<"iterator", T>;