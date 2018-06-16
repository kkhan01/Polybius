import * as React from "react";
import {Component, ComponentClass, ComponentType, ReactNode} from "react";


export const bindProps = function <P = {}>(componentClass: ComponentClass<P>, props: P): ComponentClass<{}> {
    const Bound: ComponentClass<{}> = class extends Component<{}> {
        
        public render(): ReactNode {
            return React.createElement(componentClass, props);
        }
        
    };
    const properties: {[property: string]: PropertyDescriptor} = Object.getOwnPropertyDescriptors(componentClass);
    delete properties.prototype;
    delete properties.length;
    Object.defineProperties(Bound, properties);
    return Bound;
};