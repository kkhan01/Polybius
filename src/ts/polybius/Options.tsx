import * as React from "react";
import {Component, ReactNode, SFC} from "react";
import * as ReactDOM from "react-dom";
import {anyWindow} from "../util/anyWindow";
import {Path} from "./DownloadRouter";


export interface RouterOptions {
    
    destination: Path;
    
    filename?: string;
    
    extension?: string;
    
}


const Option: SFC<{option: RouterOptions}> = ({option: {destination, filename, extension}}) => {
    return <tr>
        <td>{destination}</td>
        {filename ? <td>{filename}</td> : ""}
        {extension ? <td>{extension}</td> : ""}
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
    
    private readonly options: RouterOptions[];
    
    public constructor(props: {}) {
        super(props);
        this.options = [];
    }
    
    public render(): ReactNode {
        return <div>
            <table>
                <tr>
                    <td>Destination</td>
                    <td>Filename</td>
                    <td>Extension</td>
                </tr>
                <ExistingOptions options={this.state.options}/>
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