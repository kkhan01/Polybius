import * as React from "react";
import {Component, ReactNode, SFC} from "react";
import {render} from "react-dom";
import {globals} from "../util/anyWindow";
import {Repeat} from "../util/components/Repeat";
import {Routers, RouterType} from "./Router";
import {RouterRule} from "./RouterRule";
import {storage} from "./Storage";

interface RouterTypesDropdownProps {
    
    readonly current: RouterType;
    
}

class RouterTypesDropdown extends Component<RouterTypesDropdownProps, {}> {
    
    // private readonly ref: NotNullRef<HTMLDivElement> = createNotNullRef();
    
    public componentDidMount(): void {
        // const elements = document.querySelectorAll(".dropdown-trigger");
        // M.Dropdown.init(elements, {});
    }
    
    public render(): ReactNode {
        return <select style={{display: "block"}} defaultValue={this.props.current as string}>
            {Routers.map(({type, displayName}) =>
                <option key={type} value={type}>{displayName}</option>)
            }
        </select>;
    }
    
}


const Rule: SFC<{rule: RouterRule}> = (
    {
        rule: {
            enabled,
            test: {input: testInput, type: testType},
            route: {input: routeInput, conflictAction, type: routeType},
            type: ruleType,
        }
    }
) => {
    const x = <div>
        <div>
            {["Type", "Test", "Destination Directory", "Enabled"]
                .map((header, i) => <div key={i}>{header}</div>)
            }
        </div>
        <div>
            <RouterTypesDropdown current={ruleType}/>
        
        </div>
    </div>;
    
    return <table>
        {x}
        
        <tbody>
            <tr>
                <td>
                    <RouterTypesDropdown current={testType}/>
                </td>
                <td>
                    <input defaultValue={testInput} id="test" type="text" className="validate"/>
                    <label htmlFor="test"/>
                </td>
                <td>
                    <input defaultValue={routeInput} id="destdir" type="text" className="validate"/>
                    <label htmlFor="destdir"/>
                </td>
                <td>
                    <input defaultValue={enabled.toString()} id="enabled" type="text" className="validate"/>
                    <label htmlFor="enabled"/>
                </td>
            </tr>
        </tbody>
    </table>;
};


const ExistingRules: SFC<{rules: RouterRule[]}> = ({rules}) => {
    return <div>
        {rules.map((rule, i) => <Rule key={i} rule={rule}/>)}
    </div>;
};

interface RulesState {
    
    readonly rules: RouterRule[];
    
}


class Rules extends Component<{}, RulesState> {
    
    // not true
    // noinspection TypeScriptFieldCanBeMadeReadonly
    private rules: RouterRule[] = [];
    
    public constructor(props: {}) {
        super(props);
        (async () => {
            this.rules = await storage.routerRules.get();
            this.forceUpdate();
        })();
    }
    
    public render(): ReactNode {
        // TODO <div> cannot be a child of <table>
        return <div>
            <table>
                
                <ExistingRules rules={this.rules}/>
                <tr>
                    <td><input type="text" name="destination" defaultValue="~/"/></td>
                    <td><input type="text" name="firstname" defaultValue=""/></td>
                    <td><input type="text" name="extension" defaultValue=""/></td>
                </tr>
            </table>
            
            {(() => {
                const br5 = <Repeat times={5} render={() => <br/>}/>;
                return Object.entries({
                    PNG: "http://www.freepngimg.com/download/facebook/1-2-facebook-download-png.png",
                    PDF: "http://www.pdf995.com/samples/pdf.pdf",
                    OnlineLogo: "https://raw.githubusercontent.com/kkysen/Polybius/master/dist/logo.png",
                    Google: "https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_share.jpg",
                    Polybius: "http://localhost:8000/Polybius/dist/Polybius.js",
                    LocalLogo: "http://localhost:8000/Polybius/dist/logo.png",
                }).map(([name, link], i) =>
                    <div key={i}>
                        {i === 0 && br5}
                        <a href={link} download style={{fontSize: "larger", margin: 100}}>
                            {name}
                        </a>
                        {br5}
                    </div>
                );
            })()}
        </div>;
    }
    
}

export const reactMain = function(): void {
    const root = document.body.appendDiv();
    globals({root});
    render(<Rules/>, root);
};