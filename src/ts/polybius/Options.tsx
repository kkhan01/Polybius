import * as React from "react";
import {Component, ReactNode, SFC} from "react";
import * as ReactDOM from "react-dom";
import {anyWindow} from "../util/anyWindow";
import {DownloadRouter, RouterOptions} from "./DownloadRouter";
import {getRouterOptions} from "./serialize";


// export interface RouterOptions {
//
//     destination: Path;
//
//     filename?: string;
//
//     extension?: string;
//
// }


const Option: SFC<{option: RouterOptions}> = ({option: {enabled, test, route, type}}) => {
    const {displayName} = DownloadRouter[type];
    return <tr>
        <td>{displayName}</td>
        <td>{test}</td>
        <td>{route.toString()}</td>
        <td>{enabled}</td>
    </tr>;
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