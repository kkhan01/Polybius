import {addDownloadListener} from "./polybius/downloadListener";
import {reactMain} from "./polybius/Rules";
import {addSampleRules} from "./polybius/sampleRules";
import {addExtensions} from "./util/extensions/allExtensions";


const main = function(): void {
    addExtensions();
    // loadExample();
    addSampleRules();
    addDownloadListener();
    reactMain();
};

main();