"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
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
        return React.createElement("select", { style: { display: "block" }, defaultValue: this.props.current }, Router_1.Routers.map(({ type, displayName }) => React.createElement("option", { key: type, value: type }, displayName)));
    }
}
const Rule = ({ rule: { enabled, test: { input: testInput, type: testType }, route: { input: routeInput, conflictAction, type: routeType }, type: ruleType, } }) => {
    const x = React.createElement("div", null,
        React.createElement("div", null, ["Type", "Test", "Destination Directory", "Enabled"]
            .map((header, i) => React.createElement("div", { key: i }, header))),
        React.createElement("div", null,
            React.createElement(RouterTypesDropdown, { current: ruleType })));
    return React.createElement("table", null,
        x,
        React.createElement("tbody", null,
            React.createElement("tr", null,
                React.createElement("td", null,
                    React.createElement(RouterTypesDropdown, { current: testType })),
                React.createElement("td", null,
                    React.createElement("input", { defaultValue: testInput, id: "test", type: "text", className: "validate" }),
                    React.createElement("label", { htmlFor: "test" })),
                React.createElement("td", null,
                    React.createElement("input", { defaultValue: routeInput, id: "destdir", type: "text", className: "validate" }),
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
            (() => {
                const br5 = React.createElement(Repeat_1.Repeat, { times: 5, render: () => React.createElement("br", null) });
                return Object.entries({
                    PNG: "http://www.freepngimg.com/download/facebook/1-2-facebook-download-png.png",
                    PDF: "http://www.pdf995.com/samples/pdf.pdf",
                    OnlineLogo: "https://raw.githubusercontent.com/kkysen/Polybius/master/dist/logo.png",
                    Google: "https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_share.jpg",
                    Polybius: "http://localhost:8000/Polybius/dist/Polybius.js",
                    LocalLogo: "http://localhost:8000/Polybius/dist/logo.png",
                }).map(([name, link], i) => React.createElement("div", { key: i },
                    i === 0 && br5,
                    React.createElement("a", { href: link, download: true, style: { fontSize: "larger", margin: 100 } }, name),
                    br5));
            })());
    }
}
exports.reactMain = function () {
    const root = document.body.appendDiv();
    anyWindow_1.globals({ root });
    react_dom_1.render(React.createElement(Rules, null), root);
};
//# sourceMappingURL=Rules.js.map