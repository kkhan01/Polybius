import {Path} from "../util/Path";
import DownloadItem = chrome.downloads.DownloadItem;

export interface DownloadAction {
    
    readonly path: Path;
    
    readonly conflictAction: "uniquify" | "overwrite" | "prompt"
    
}

export interface DownloadRoute {
    
    (download: DownloadItem): DownloadAction;
    
}