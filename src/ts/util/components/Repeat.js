"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const Range_1 = require("../../../share/util/Range");
class Repeat extends react_1.Component {
    render() {
        const { props: { times, render } } = this;
        return (React.createElement("div", null, Range_1.Range.new(times).map(i => (React.createElement("div", { key: i }, render())))));
    }
}
exports.Repeat = Repeat;
//# sourceMappingURL=Repeat.js.map