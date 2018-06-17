import {DownloadRouter} from "./DownloadRouter";
import {RouterOptions} from "./Options";

export const getRouterOptions = (() => {
    let options: RouterOptions[] | null = null;
    return function(): RouterOptions[] {
    
    };
})();

export const getRouters = (() => {
    let routes: DownloadRouter[] | null = null;
    return function(): DownloadRouter[] {
        return routes || (routes = JSON.parse(localStorage.routes));
    };
})();