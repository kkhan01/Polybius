import * as React from "react";
import {ReactNode, SFC} from "react";
import * as ReactDOM from "react-dom";
import {DownloadAction} from "./DownloadRouter";

let selectedAction: DownloadAction | null = null;

const actionList = function(actionArray: DownloadAction[]): ReactNode {
    selectedAction = actionArray[0];
    const listItems = actionArray.map((action, i) =>
        <p>
            <label>
                <input name="group1" type="radio" checked={i === 0}
                       onClick={() => selectedAction = action}/>
                <span>{action}</span>
            </label>
        </p>
    );
    return (
        <form>{listItems}</form>
    );
};

interface PromptProps {
    
    readonly actions: DownloadAction[];
    
    select(action: DownloadAction): void;
    
}

const Prompt: SFC<PromptProps> = ({actions, select}) => {
    return <div>
        It seems multiple rules can be applied. Please choose a path:
        <br/>
        {actionList(actions)}
        <a className="waves-effect waves-light btn"
           onClick={() => select(selectedAction as DownloadAction)}>
            Apply
        </a>
    </div>;
};

export const renderPrompt = function(actions: DownloadAction[], select: (action: DownloadAction) => void): void {
    const popupRoot = document.body.appendDiv();
    ReactDOM.render(<Prompt actions={actions} select={select}/>, popupRoot);
};