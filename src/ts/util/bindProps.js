"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
exports.bindProps = function (componentClass, props) {
    const Bound = class extends react_1.Component {
        render() {
            return React.createElement(componentClass, props);
        }
    };
    const properties = Object.getOwnPropertyDescriptors(componentClass);
    delete properties.prototype;
    delete properties.length;
    Object.defineProperties(Bound, properties);
    return Bound;
};
//# sourceMappingURL=bindProps.js.map