import * as React from "react";
import {ReactNode, SFC} from "react";
import * as ReactDOM from "react-dom";
import {DownloadAction} from "./DownloadRoute";

let selectedAction: DownloadAction | null = null;

const actionList = function(actions: DownloadAction[]): ReactNode {
    selectedAction = actions[0];
    return (
        <form>
            {actions.map((action, i) => {
                    const {path: {path}} = action;
                    return <p key={i}>
                        <label>
                            <input
                                name="group1"
                                type="radio"
                                checked={i === 0}
                                onClick={() => selectedAction = action}
                            />
                            <span>{path}</span>
                        </label>
                    </p>;
                }
            )}
        </form>
    );
};

interface ConflictingRulesProps {
    
    readonly actions: DownloadAction[];
    
    select(action: DownloadAction): void;
    
}

const ConflictingRules: SFC<ConflictingRulesProps> = ({actions, select}) => {
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
    ReactDOM.render(<ConflictingRules actions={actions} select={select}/>, popupRoot);
};