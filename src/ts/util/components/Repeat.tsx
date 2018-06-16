import * as React from "react";
import {Component, ReactNode} from "react";
import {Range} from "../../../share/util/Range";

export class Repeat extends Component<{
    times: number,
    render: () => ReactNode,
}, {}> {
    
    public render(): ReactNode {
        const {props: {times, render}} = this;
        return (<div>
            {Range.new(times).map(i => (
                <div key={i}>
                    {render()}
                </div>
            ))}
        </div>);
    }
    
}