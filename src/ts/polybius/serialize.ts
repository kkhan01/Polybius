import {cache} from "../util/cache";
import {DownloadRouter, SavedRouterOptions} from "./DownloadRouter";
import {RouterOptions} from "./DownloadRouter";

const getSavedRouterOptions = cache(() => JSON.parse(localStorage.routerOptions) as SavedRouterOptions[]);

export const getRouterOptions = () => getSavedRouterOptions() as RouterOptions[];

export const getRouters = cache(() => {
    return getSavedRouterOptions().map((options) => {
        return DownloadRouter[options.type](options);
    }) as DownloadRouter[];
});