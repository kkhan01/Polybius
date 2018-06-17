import {cache} from "../util/cache";
import {DownloadRouter, RouterOptions} from "./DownloadRouter";

const getRouterOptions = cache(() => JSON.parse(localStorage.routerOptions) as RouterOptions[]);

export const getRouters = cache(() => {
    return getRouterOptions()
        .map(options => DownloadRouter[options.type].create(options)) as DownloadRouter[];
});

export const setRouterOptions = function(options: RouterOptions[]): void {
    localStorage.routerOptions = JSON.stringify(options);
};