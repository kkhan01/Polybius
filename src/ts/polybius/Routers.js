"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const ReactDOM = require("react-dom");
const anyWindow_1 = require("../util/anyWindow");
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
const Option = ({ option: { destination, filename, extension } }) => {
    return React.createElement("tr", null,
        React.createElement("td", null, destination),
        filename ? React.createElement("td", null, filename) : "",
        extension ? React.createElement("td", null, extension) : "");
};
const ExistingOptions = ({ routers }) => {
    return React.createElement("div", null, routers.map((option, i) => React.createElement(Option, { key: i, router: option })));
};
class Options extends react_1.Component {
    constructor(props) {
        super(props);
        this.routers = serialize_1.getRouters();
    }
    render() {
        return React.createElement("div", null,
            React.createElement("table", null,
                React.createElement("tr", null,
                    React.createElement("td", null, "Destination"),
                    React.createElement("td", null, "Filename"),
                    React.createElement("td", null, "Extension")),
                React.createElement(ExistingOptions, { routers: this.state.options }),
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
//# sourceMappingURL=Routers.js.map