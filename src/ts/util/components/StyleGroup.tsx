import * as React from "react";
import {Children, Component, CSSProperties, ReactNode} from "react";


export interface StyleGroupProps {
    
    style: CSSProperties;
    
}


export class StyleGroup extends Component<StyleGroupProps, {}> {
    
    public render(): ReactNode {
        const {props: {children, style}} = this;
        return (<div>
            {Children.map(children, (child, i) => (
                <span key={i} style={style}>
                    {child}
                </span>
            ))}
        </div>);
    }
    
}