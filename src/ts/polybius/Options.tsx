import * as React from "react";
import {Component, ReactNode, SFC} from "react";
import * as ReactDOM from "react-dom";
import {anyWindow} from "../util/anyWindow";
import {createNotNullRef, NotNullRef} from "../util/refs/NotNullRef";
import {DownloadRouterType, RouterOptions, Routers} from "./DownloadRouter";
import {getRouterOptions} from "./serialize";

interface RouterTypesDropdownProps {
    
    current: DownloadRouterType;
    
}

class RouterTypesDropdown extends Component<RouterTypesDropdownProps, {}> {
    
    // private readonly ref: NotNullRef<HTMLDivElement> = createNotNullRef();
    
    public componentDidMount(): void {
        // const elements = document.querySelectorAll(".dropdown-trigger");
        // M.Dropdown.init(elements, {});
    }
    
    public render(): ReactNode {
        return <select style={{display: "block"}}>
            {Routers.map(({type, displayName}) =>
                <option key={type} value={type} selected={this.props.current === type}>{displayName}</option>)
            }
        </select>;
    }
    
}


const Option: SFC<{option: RouterOptions}> = ({option: {enabled, test, route, type}}) => {
    console.log(route);
    
    return <table>
        <thead>
            <tr>
                <th>Type</th>
                <th>Test</th>
                <th>Destination Directory</th>
                <th>Enabled</th>
            </tr>
        </thead>
        
        <tbody>
            <tr>
                <td>
                    <RouterTypesDropdown current={type}/>
                </td>
                <td>
                    <input value={test} id="test" type="text" className="validate"/>
                    <label htmlFor="test"/>
                </td>
                <td>
                    <input value={route.toString()} id="destdir" type="text" className="validate"/>
                    <label htmlFor="destdir"/>
                </td>
                <td>
                    <input value={enabled.toString()} id="enabled" type="text" className="validate"/>
                    <label htmlFor="enabled"/>
                </td>
            </tr>
        </tbody>
    </table>;
};


const ExistingOptions: SFC<{options: RouterOptions[]}> = ({options}) => {
    return <div>
        {options.map((option, i) => <Option key={i} option={option}/>)}
    </div>;
};

interface OptionsState {
    
    readonly options: RouterOptions[];
    
}


class Options extends Component<{}, OptionsState> {
    
    private readonly options: RouterOptions[] = getRouterOptions();
    
    public constructor(props: {}) {
        super(props);
        console.log(this.options);
    }
    
    public render(): ReactNode {
        return <div>
            <table>
                <tr>
                    <td>Type</td>
                    <td>Test</td>
                    <td>Destination Directory</td>
                    <td>Enabled</td>
                </tr>
                <ExistingOptions options={this.options}/>
                <tr>
                    <td><input type="text" name="destination" value="~/"/></td>
                    <td><input type="text" name="firstname" value=""/></td>
                    <td><input type="text" name="extension" value=""/></td>
                </tr>
            </table>
        </div>;
    }
    
}

export const reactMain = function(): void {
    const root = document.body.appendDiv();
    anyWindow.root = root;
    ReactDOM.render(<Options/>, root);
};