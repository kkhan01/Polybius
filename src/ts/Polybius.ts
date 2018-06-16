import chromep from "chrome-promise";
import {loadExample} from "./example";
import {addExtensions} from "./util/extensions/allExtensions";


const main = function(): void {
    addExtensions();
    loadExample();
    
    (async () => {
        const fs = await chromep.fileSystemProvider.mount({
            fileSystemId: "",
            displayName: "",
        });
        
    })();
};

main();