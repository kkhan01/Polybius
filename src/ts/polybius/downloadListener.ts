import {DownloadAction} from "./DownloadRoute";
import {Router} from "./Router";
import {storage} from "./Storage";

export const addDownloadListener = function(): void {
    chrome.downloads && chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
        const select = ({path, conflictAction}: DownloadAction): void => {
            const filename = path.toString().slice(1);
            console.log(filename);
            suggest({filename, conflictAction});
        };
        
        const route = (routers: Router[]) => {
            const actions: DownloadAction[] = routers
                .filter(router => router.test(downloadItem))
                .map(router => router.route(downloadItem));
            
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
            route(await storage.routers.get());
        })();
        
        return true; // must return true if suggesting asynchronously
    });
};
