export interface Range {
    
    map<T>(func: (i: number) => T): T[];
    
    forEach(func: (i: number) => void): void;
    
    toArray(): number[];
    
    toInterval(): number[];
    
}

export type RangeClass = {
    
    readonly new: (from: number, to?: number) => Range;
    
    ofDomain(domain: number[]): Range;
    
};

export const Range: RangeClass = {
    
    new(from: number, to?: number): Range {
        const _from: number = to === undefined ? 0 : from;
        const _to: number = to === undefined ? from : to;
        
        return {
            
            toArray(): number[] {
                return [...new Array(_to - _from)].map((e, i) => i + _from);
            },
            
            map<T>(func: (i: number) => T): T[] {
                return this.toArray().map(func);
            },
            
            forEach(func: (i: number) => void): void {
                for (let i: number = _from; i < _to; i++) {
                    func(i);
                }
            },
            
            toInterval(): number[] {
                return [_from, _to];
            },
            
        };
        
    },
    
    ofDomain(domain: number[]): Range {
        return this.new(Math.min(...domain), Math.max(...domain));
    },
    
};