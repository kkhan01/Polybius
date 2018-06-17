"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
let selectedAction = null;
const actionList = function (actionArray) {
    selectedAction = actionArray[0];
    const listItems = actionArray.map((action, i) => React.createElement("p", null,
        React.createElement("label", null,
            React.createElement("input", { name: "group1", type: "radio", checked: i === 0, onClick: () => selectedAction = action }),
            React.createElement("span", null, action))));
    return (React.createElement("form", null, listItems));
};
const Prompt = ({ actions, select }) => {
    return React.createElement("div", null,
        "It seems multiple rules can be applied. Please choose a path:",
        React.createElement("br", null),
        actionList(actions),
        React.createElement("a", { className: "waves-effect waves-light btn", onClick: () => select(selectedAction) }, "Apply"));
};
exports.renderPrompt = function (actions, select) {
    const popupRoot = document.body.appendDiv();
    ReactDOM.render(React.createElement(Prompt, { actions: actions, select: select }), popupRoot);
};
//# sourceMappingURL=Prompt.js.map