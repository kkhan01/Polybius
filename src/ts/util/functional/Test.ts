export interface Test<T> {
    
    (t: T): boolean;
    
}

export interface AsyncTest<T> {
    
    (t: T): Promise<boolean>;
    
}