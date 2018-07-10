export interface Comparator<T> {
    
    (t1: T, t2: T): number;
    
}