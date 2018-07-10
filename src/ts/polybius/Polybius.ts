import {globals} from "../util/anyWindow";
import {ArrayStack} from "../util/collections/ArrayStack";
import {HashEquals} from "../util/collections/HashEquals";
import {PureStack, Stack} from "../util/collections/Stack";
import {addExtensions} from "../util/extensions/allExtensions";
import {sandboxMain} from "../util/sandbox/SandboxMessenger";
import {addDownloadListener} from "./downloadListener";
import {reactMain} from "./Rules";
import {addSampleRules} from "./sampleRules";


const main = function(): void {
    addExtensions();
    // loadExample();
    addSampleRules();
    addDownloadListener();
    reactMain();
    sandboxMain().then(); // TODO
    
    const stack: PureStack<number> = ArrayStack.new({hashEquals: HashEquals.referential()});
    stack.push(1);
    console.log(stack);
    console.log(stack.pop());
    
    const _stack: Stack<number> = stack as Stack<number>;
    _stack.forEach((e, i) => console.log(e, i));
    globals({stack});
    
};

main();