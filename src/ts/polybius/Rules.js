"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const ReactDOM = require("react-dom");
const anyWindow_1 = require("../util/anyWindow");
const Repeat_1 = require("../util/components/Repeat");
const Router_1 = require("./Router");
const Storage_1 = require("./Storage");
class RouterTypesDropdown extends react_1.Component {
    // private readonly ref: NotNullRef<HTMLDivElement> = createNotNullRef();
    componentDidMount() {
        // const elements = document.querySelectorAll(".dropdown-trigger");
        // M.Dropdown.init(elements, {});
    }
    render() {
        return React.createElement("select", { style: { display: "block" } }, Router_1.Routers.map(({ type, displayName }) => React.createElement("option", { key: type, value: type, selected: this.props.current === type }, displayName)));
    }
}
const Rule = ({ rule: { enabled, test, route, type } }) => {
    return React.createElement("table", null,
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", null, "Type"),
                React.createElement("th", null, "Test"),
                React.createElement("th", null, "Destination Directory"),
                React.createElement("th", null, "Enabled"))),
        React.createElement("tbody", null,
            React.createElement("tr", null,
                React.createElement("td", null,
                    React.createElement(RouterTypesDropdown, { current: type })),
                React.createElement("td", null,
                    React.createElement("input", { defaultValue: test, id: "test", type: "text", className: "validate" }),
                    React.createElement("label", { htmlFor: "test" })),
                React.createElement("td", null,
                    React.createElement("input", { defaultValue: route.toString(), id: "destdir", type: "text", className: "validate" }),
                    React.createElement("label", { htmlFor: "destdir" })),
                React.createElement("td", null,
                    React.createElement("input", { defaultValue: enabled.toString(), id: "enabled", type: "text", className: "validate" }),
                    React.createElement("label", { htmlFor: "enabled" })))));
};
const ExistingRules = ({ rules }) => {
    return React.createElement("div", null, rules.map((rule, i) => React.createElement(Rule, { key: i, rule: rule })));
};
class Rules extends react_1.Component {
    constructor(props) {
        super(props);
        // not true
        // noinspection TypeScriptFieldCanBeMadeReadonly
        this.rules = [];
        (async () => {
            this.rules = await Storage_1.storage.routerRules.get();
            this.forceUpdate();
        })();
    }
    render() {
        // TODO <div> cannot be a child of <table>
        return React.createElement("div", null,
            React.createElement("table", null,
                React.createElement(ExistingRules, { rules: this.rules }),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("input", { type: "text", name: "destination", defaultValue: "~/" })),
                    React.createElement("td", null,
                        React.createElement("input", { type: "text", name: "firstname", defaultValue: "" })),
                    React.createElement("td", null,
                        React.createElement("input", { type: "text", name: "extension", defaultValue: "" })))),
            React.createElement(Repeat_1.Repeat, { times: 5, render: () => React.createElement("br", null) }),
            React.createElement("a", { href: "http://www.freepngimg.com/download/facebook/1-2-facebook-download-png.png", download: true, style: { fontSize: "larger", margin: 100 } }, "PNG"),
            React.createElement(Repeat_1.Repeat, { times: 5, render: () => React.createElement("br", null) }),
            React.createElement("a", { href: "http://www.pdf995.com/samples/pdf.pdf", download: true, style: { fontSize: "larger", margin: 100 } }, "PDF"),
            React.createElement(Repeat_1.Repeat, { times: 5, render: () => React.createElement("br", null) }),
            React.createElement("a", { href: "https://github.com/kkysen/Polybius/raw/master/src/img/logo.png", download: true, style: { fontSize: "larger", margin: 100 } }, "Logo"),
            React.createElement(Repeat_1.Repeat, { times: 5, render: () => React.createElement("br", null) }));
    }
}
exports.reactMain = function () {
    const root = document.body.appendDiv();
    anyWindow_1.anyWindow.root = root;
    ReactDOM.render(React.createElement(Rules, null), root);
};
//# sourceMappingURL=Rules.js.map