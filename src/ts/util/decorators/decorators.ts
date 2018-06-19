export interface FunctionDecorator<T> {
    
    <U extends T>(target: U): U;
    
}