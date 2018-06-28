import * as React from "react";
import {ReactNode, SFC} from "react";
import {RouterType} from "./Router";
import {RouterRule} from "./RouterRule";



const RuleFieldComponent: SFC<{}> = ({}) => {
    return <div>
    
    </div>;
};

interface RuleField<T> {
    
    readonly name: string;
    readonly previousValue: T;
    readonly currentValue: T;
    
    render(): ReactNode;
    
}

interface RuleFields {
    
    readonly type: RuleField<RouterType>;
    readonly test: RuleField<string>;
    readonly route: RuleField<string>;
    readonly enabled: RuleField<boolean>;
    
}

const EditableRule: SFC<{rule: RuleFields}> = ({rule}) => {
    return <div>
        {(Object.values(rule) as RuleField<any>[]).map(({name}) => {
            return <div key={name}>
            
            </div>;
        })}
    </div>;
};