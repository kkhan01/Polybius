"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const anyWindow_1 = require("../util/anyWindow");
const Option = ({ option }) => {
    return React.createElement("tr", null,
        React.createElement("td", null, option.destination),
        option.filename ? React.createElement("td", null, option.filename) : "",
        option.extension ? React.createElement("td", null, option.extension) : "");
};
const Options = ({ options }) => {
    return React.createElement("div", null,
        React.createElement("table", null,
            React.createElement("tr", null,
                React.createElement("td", null, "Destination"),
                React.createElement("td", null, "Filename"),
                React.createElement("td", null, "Extension")),
            options.map((option, i) => React.createElement(Option, { key: i, option: option })),
            React.createElement("tr", null,
                React.createElement("td", null,
                    React.createElement("input", { type: "text", name: "destination", value: "~/" })),
                React.createElement("td", null,
                    React.createElement("input", { type: "text", name: "firstname", value: "" })),
                React.createElement("td", null,
                    React.createElement("input", { type: "text", name: "extension", value: "" })))));
};
exports.reactMain = function () {
    const root = document.body.appendDiv();
    anyWindow_1.anyWindow.root = root;
    ReactDOM.render(React.createElement(Options, { options: [
            {
                destination: "",
                extension: "js",
            }
        ] }), root);
};
//# sourceMappingURL=Options.js.map