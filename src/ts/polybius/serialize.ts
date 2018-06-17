import {cache} from "../util/cache";
import {DownloadRouter, Path, RouterOptions} from "./DownloadRouter";

export const getRouterOptions = cache(() =>
    (JSON.parse(localStorage.routerOptions || setRouterOptions([])) as RouterOptions[])
        .map(({type, enabled, test, route}) => ({type, enabled, test, route: Path.of(route.path)}))
);

export const getRouters = cache(() => {
    return getRouterOptions()
        .map(options => DownloadRouter[options.type].create(options)) as DownloadRouter[];
});

export const setRouterOptions = function(options: RouterOptions[]): string {
    const json = JSON.stringify(options);
    localStorage.routerOptions = json;
    return json;
};