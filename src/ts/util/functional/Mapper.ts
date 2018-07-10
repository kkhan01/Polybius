export interface Mapper<T, U> {
    
    (t: T, i: number): U;
    
}