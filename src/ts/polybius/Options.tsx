import * as React from "react";
import {SFC} from "react";
import * as ReactDOM from "react-dom";
import {anyWindow} from "../util/anyWindow";
import {Path} from "./DownloadRouter";


export interface RouterOptions {
    
    destination: Path;
    
    filename?: string;
    
    extension?: string;
    
}


const Option: SFC<{option: RouterOptions}> = ({option}) => {
    return <tr>
        <td>{option.destination}</td>
        {option.filename ? <td>{option.filename}</td> : ""}
        {option.extension ? <td>{option.extension}</td> : ""}
    </tr>;
};


const Options: SFC<{options: RouterOptions[]}> = ({options}) => {
    return <div>
        <table>
            <tr>
                <td>Destination</td>
                <td>Filename</td>
                <td>Extension</td>
            </tr>
            {options.map((option, i) => <Option key={i} option={option}/>)}
            <tr>
                <td><input type="text" name="destination" value="~/"/></td>
                <td><input type="text" name="firstname" value=""/></td>
                <td><input type="text" name="extension" value=""/></td>
            </tr>
        </table>
    </div>;
};

export const reactMain = function(): void {
    const root = document.body.appendDiv();
    anyWindow.root = root;
    ReactDOM.render(<Options options={[
        {
            destination: "" as any as Path,
            extension: "js",
        }
    ]}/>, root);
};