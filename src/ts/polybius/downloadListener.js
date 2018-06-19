"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = require("./Storage");
exports.addDownloadListener = function () {
    chrome.downloads && chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
        const select = ({ path, conflictAction }) => {
            const filename = path.toString().slice(1);
            console.log(filename);
            suggest({ filename, conflictAction });
        };
        const route = (routers) => {
            const actions = routers
                .filter(router => router.test(downloadItem))
                .map(router => router.route(downloadItem));
            if (actions.length === 0) {
                suggest({ filename: downloadItem.filename, conflictAction: "prompt" });
            }
            else if (actions.length === 1) {
                select(actions[0]);
            }
            else {
                select(actions[0]);
                // TODO use renderPrompt
                // renderPrompt(actions, select);
            }
        };
        (async () => {
            route(await Storage_1.storage.routers.get());
        })();
        return true; // must return true if suggesting asynchronously
    });
};
//# sourceMappingURL=downloadListener.js.map