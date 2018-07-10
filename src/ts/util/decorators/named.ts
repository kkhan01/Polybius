export interface Named {
    
    readonly name: string;
    
}

export const named = function(name: string): ClassDecorator {
    
    return function <T extends Function>(target: T): T {
        return target.named(name);
    };
    
};