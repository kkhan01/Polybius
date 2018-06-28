import {Route} from "./Route";
import {Router} from "./Router";
import {storage} from "./Storage";
import {Test} from "./Test";

export const addSampleRules = function(): void {
    (async () => {
        await storage.routers.set(await Promise.all([
            Router.urlHref({
                enabled: true,
                test: Test.regex({input: RegExp.toSource(/^.*google.*$/i)}),
                route: Route.path({input: "google"}),
            }),
            Router.filename({
                enabled: true,
                test: Test.string({input: "logo"}),
                route: Route.path({input: "logos"}),
            }),
            Router.extension({
                enabled: true,
                test: Test.string({input: "png"}),
                route: Route.path({input: "png"}),
            }),
            Router.extension({
                enabled: true,
                test: Test.string({input: "pdf"}),
                route: Route.path({input: "pdf"}),
            }),
            Router.extension({
                enabled: true,
                test: Test.string({input: "js"}),
                route: Route.path({input: "js"}),
            }),
        ]));
    })();
};