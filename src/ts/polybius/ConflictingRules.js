"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
let selectedAction = null;
const actionList = function (actions) {
    selectedAction = actions[0];
    return (React.createElement("form", null, actions.map((action, i) => {
        const { path: { path } } = action;
        return React.createElement("p", { key: i },
            React.createElement("label", null,
                React.createElement("input", { name: "group1", type: "radio", checked: i === 0, onClick: () => selectedAction = action }),
                React.createElement("span", null, path)));
    })));
};
const ConflictingRules = ({ actions, select }) => {
    return React.createElement("div", null,
        "It seems multiple rules can be applied. Please choose a path:",
        React.createElement("br", null),
        actionList(actions),
        React.createElement("a", { className: "waves-effect waves-light btn", onClick: () => select(selectedAction) }, "Apply"));
};
exports.renderPrompt = function (actions, select) {
    const popupRoot = document.body.appendDiv();
    ReactDOM.render(React.createElement(ConflictingRules, { actions: actions, select: select }), popupRoot);
};
//# sourceMappingURL=ConflictingRules.js.map