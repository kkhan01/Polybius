"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const RuleFieldComponent = ({}) => {
    return React.createElement("div", null);
};
const EditableRule = ({ rule }) => {
    return React.createElement("div", null, Object.values(rule).map(({ name }) => {
        return React.createElement("div", { key: name });
    }));
};
//# sourceMappingURL=EditableRule.js.map