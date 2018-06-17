"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const ReactDOM = require("react-dom");
const anyWindow_1 = require("../util/anyWindow");
const DownloadRouter_1 = require("./DownloadRouter");
const serialize_1 = require("./serialize");
// export interface RouterOptions {
//
//     destination: Path;
//
//     filename?: string;
//
//     extension?: string;
//
// }
const RouterTypes = props => {
    return React.createElement("div", null);
};
const Option = ({ option: { enabled, test, route, type } }) => {
    const { displayName } = DownloadRouter_1.DownloadRouter[type];
    return React.createElement("tr", null,
        React.createElement("td", null, displayName),
        React.createElement("td", null, test),
        React.createElement("td", null, route.toString()),
        React.createElement("td", null, enabled));
};
const ExistingOptions = ({ options }) => {
    return React.createElement("div", null, options.map((option, i) => React.createElement(Option, { key: i, option: option })));
};
class Options extends react_1.Component {
    constructor(props) {
        super(props);
        this.options = serialize_1.getRouterOptions();
    }
    render() {
        return React.createElement("div", null,
            React.createElement("table", null,
                React.createElement("tr", null,
                    React.createElement("td", null, "Type"),
                    React.createElement("td", null, "Test"),
                    React.createElement("td", null, "Destination Directory"),
                    React.createElement("td", null, "Enabled")),
                React.createElement(ExistingOptions, { options: this.options }),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("input", { type: "text", name: "destination", value: "~/" })),
                    React.createElement("td", null,
                        React.createElement("input", { type: "text", name: "firstname", value: "" })),
                    React.createElement("td", null,
                        React.createElement("input", { type: "text", name: "extension", value: "" })))));
    }
}
exports.reactMain = function () {
    const root = document.body.appendDiv();
    anyWindow_1.anyWindow.root = root;
    ReactDOM.render(React.createElement(Options, null), root);
};
//# sourceMappingURL=Options.js.map