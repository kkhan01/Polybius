import * as React from "react";
import {Test} from "../util/functional/Test";

const dynamicFunction = function(functionBody: string): Test<string> {
    const test: Function = new Function("download", functionBody);
    const returnValue = test("test.pdf"); // to catch errors
    if (typeof returnValue !== "boolean") {
        throw new Error("Return value of custom filter function must be a boolean: " + test);
    }
    return test as Test<string>;
};