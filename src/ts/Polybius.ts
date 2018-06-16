import {loadExample} from "./example";
import {addExtensions} from "./util/extensions/allExtensions";


const main = function(): void {
    addExtensions();
    loadExample();
};

main();