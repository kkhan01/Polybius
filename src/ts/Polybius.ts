import {f} from "./polybius/DownloadRouter";
import {reactMain} from "./polybius/Options";
import {addExtensions} from "./util/extensions/allExtensions";


const main = function(): void {
    addExtensions();
    // loadExample();
    f();
    reactMain();
};

main();