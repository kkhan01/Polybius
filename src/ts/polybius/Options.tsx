import * as React from "react";
import {SFC} from "react";
import * as ReactDOM from "react-dom";
import {Path} from "./DownloadRouter";


interface RouterOptions {

    destination: Path;
    
    regex: RegExp;
    
    filename?: string;
    
    extension?: string;

}


const Options: SFC<{options: RouterOptions[]}> = ({}) => {
    ["hello", "world"].map(s => s.length);
    return <div>
        {["hello", "world"].map(s => <div>{s}</div>)}
    </div>;
};

export const reactMain = function(): void {
    ReactDOM.render(<Options options={[]}/>, document.body.appendDiv());
};