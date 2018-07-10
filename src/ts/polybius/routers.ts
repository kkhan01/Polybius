import {Router} from "./Router";
import {storage} from "./Storage";

export const setRouters = async function(routers: Promise<Router>[]): Promise<void> {
    return await storage.routers.set(await Promise.all(routers));
};

export const addRouters = async function(routers: Promise<Router>[]): Promise<void> {
    return await storage.routers.set(
        (await Promise.all([storage.routers.get(), Promise.all(routers)])).flatMap(e => e));
};