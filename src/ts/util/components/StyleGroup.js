"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
class StyleGroup extends react_1.Component {
    render() {
        const { props: { children, style } } = this;
        return (React.createElement("div", null, react_1.Children.map(children, (child, i) => (React.createElement("span", { key: i, style: style }, child)))));
    }
}
exports.StyleGroup = StyleGroup;
//# sourceMappingURL=StyleGroup.js.map