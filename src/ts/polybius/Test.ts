import {AsyncTest} from "../util/functional/Test";
import {sandbox} from "../util/sandbox/SandboxMessenger";
import {parseRegExpLiteral} from "../util/utils";

interface UnTypedTestRule {
    readonly input: string;
}

export interface TestRule extends UnTypedTestRule {
    readonly type: TestType;
}

export interface Test<T> {
    readonly rule: TestRule;
    readonly test: AsyncTest<T>;
}

interface TestConstructor<T> {
    (rule: UnTypedTestRule): Promise<Test<T>>;
}

type TestConstructorMap = {[key: string]: TestConstructor<any>};

interface TestConstructors extends TestConstructorMap {
    readonly number: TestConstructor<number>;
    readonly string: TestConstructor<string>;
    readonly regex: TestConstructor<string>;
    readonly function: TestConstructor<any>;
}

type TestType = keyof TestConstructors;

export const Test: TestConstructors = {
    
    number: async rule => {
        const {input} = rule;
        const value: number = parseInt(input);
        if (isNaN(value)) {
            throw new Error(`Invalid Int: ${input}`);
        }
        return {
            rule: {
                type: "number",
                ...rule,
            },
            test: async n => value === n,
        };
    },
    
    string: async rule => {
        const {input} = rule;
        return {
            rule: {
                type: "string",
                ...rule,
            },
            test: async s => input === s,
        };
    },
    
    regex: async rule => {
        const {input} = rule;
        const regex = parseRegExpLiteral(input);
        if (!regex) {
            throw new Error(`Invalid RegExp: ${input}`);
        }
        return {
            rule: {
                type: "regex",
                ...rule,
            },
            test: async s => regex.test(s),
        };
    },
    
    function: async rule => {
        const {input} = rule;
        const func = await (await sandbox).compile<boolean>(input);
        return {
            rule: {
                type: "function",
                ...rule,
            },
            test: func,
        };
    },
    
};

export const deserializeTest = <T>(rule: TestRule) => Test[rule.type](rule);