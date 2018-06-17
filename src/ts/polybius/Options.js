"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const ReactDOM = require("react-dom");
const anyWindow_1 = require("../util/anyWindow");
const NotNullRef_1 = require("../util/refs/NotNullRef");
const DownloadRouter_1 = require("./DownloadRouter");
const serialize_1 = require("./serialize");
const RouterTypesDropdown = ({ current }) => {
    const ref = NotNullRef_1.createNotNullRef();
    return React.createElement("div", { className: "dropdown" },
        React.createElement("button", { onClick: () => ref.current.classList.toggle("show"), className: "dropbtn" }, "Dropdown"),
        React.createElement("div", { id: "myDropdown", className: "dropdown-content", ref: ref }, DownloadRouter_1.Routers.map(({ type, displayName }) => React.createElement("option", { key: type, value: displayName, selected: current === type }))));
};
const Option = ({ option: { enabled, test, route, type } }) => {
    const { displayName } = DownloadRouter_1.DownloadRouter[type];
    return React.createElement("table", null,
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", null, displayName),
                React.createElement("th", null, test),
                React.createElement("th", null, route.toString()),
                React.createElement("th", null, enabled))),
        React.createElement("tbody", null,
            React.createElement("tr", null,
                React.createElement("td", null,
                    React.createElement(RouterTypesDropdown, { current: type })),
                React.createElement("td", null,
                    React.createElement("input", { value: test, id: "test", type: "text", className: "validate" }),
                    React.createElement("label", { htmlFor: "test" })),
                React.createElement("td", null,
                    React.createElement("input", { value: route.toString(), id: "destdir", type: "text", className: "validate" }),
                    React.createElement("label", { htmlFor: "destdir" })),
                React.createElement("td", null,
                    React.createElement("input", { value: enabled.toString(), id: "enabled", type: "text", className: "validate" }),
                    React.createElement("label", { htmlFor: "enabled" })))));
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