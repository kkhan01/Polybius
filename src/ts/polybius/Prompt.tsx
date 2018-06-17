import {SFC} from "react";
import * as React from "react";
import {DownloadAction} from "./DownloadRouter";

let selectedAction: DownloadAction | null = null;

function actionlist(actionarray) {
  const listItems = actionarray.map((action, i) =>
  <p>
	<label>
		<input name="group1" type="radio" {i == 0 ? checked : unchecked} onClick={() => selectedAction = action} />
		<span>{action}</span>
  	</label>
  </p>
  );
  return (
    <form>{listItems}</form>
  );
};

interface PromptProps {
	  actions: DownloadAction[];
	  select(action: DownloadAction): void;
}

const Prompt: SFC<PromptProps> = ({actions, select}) => {
    return <div>It seems multiple rules can be applied. Please choose a path:<br/>{actionlist(actions)}
    <a class="waves-effect waves-light btn" onClick={() => select(selectedAction)}>Apply</a>
    </div>;
};