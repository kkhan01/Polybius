import {DownloadAction} from "./Route";
import {Router} from "./Router";
import {storage} from "./Storage";

export const addDownloadListener = function(): void {
    chrome.downloads && chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
        const select = function({path, conflictAction}: DownloadAction): void {
            const filename = path.toString().slice(1);
            console.log(filename);
            suggest({filename, conflictAction});
        };
        
        const route = async function(routers: Router[]): Promise<void> {
            const actions = await routers.asyncMapFilter(
                async router => await router.test(downloadItem) && await router.route(downloadItem));
            if (actions.length === 0) {
                suggest({filename: downloadItem.filename, conflictAction: "prompt"});
            } else if (actions.length === 1) {
                select(actions[0]);
            } else {
                select(actions[0]);
                // TODO use renderPrompt
                // renderPrompt(actions, select);
            }
        };
        
        (async () => {
            await route(await storage.routers.get());
        })();
        
        return true; // must return true if suggesting asynchronously
    });
};