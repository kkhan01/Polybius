import DownloadItem = chrome.downloads.DownloadItem;

export type Path = string; // TODO

export type OnDownload = Path | {
    (download: DownloadItem): void;
}

export interface DownloadRouter {
    
    (download: DownloadItem): OnDownload;
    
}

chrome.downloads.onDeterminingFilename.addListener((downloadItem => {

}));