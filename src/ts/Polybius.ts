import {loadExample} from "./example";
import {reactMain} from "./polybius/Options";
import {addExtensions} from "./util/extensions/allExtensions";


const main = function(): void {
    addExtensions();
    loadExample();
    reactMain();
};

main();