"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const Options = ({}) => {
    ["hello", "world"].map(s => s.length);
    return React.createElement("div", null, ["hello", "world"].map(s => React.createElement("div", null, s)));
};
exports.reactMain = function () {
    ReactDOM.render(React.createElement(Options, { options: [] }), document.body.appendDiv());
};
//# sourceMappingURL=Options.js.map