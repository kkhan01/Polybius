import {Route} from "./Route";
import {Router} from "./Router";
import {setRouters} from "./routers";
import {Test} from "./Test";

export const addSampleRules = function(): void {
    (async () => {
        await setRouters([
            Router.urlHref({
                test: Test.regex({input: RegExp.toSource(/^.*google.*$/i)}),
                route: Route.path({input: "google"}),
            }),
            Router.filename({
                test: Test.string({input: "logo"}),
                route: Route.path({input: "logos"}),
            }),
            Router.extension({
                test: Test.string({input: "png"}),
                route: Route.path({input: "png"}),
            }),
            Router.extension({
                test: Test.string({input: "pdf"}),
                route: Route.path({input: "pdf"}),
            }),
            Router.extension({
                test: Test.string({input: "js"}),
                route: Route.path({input: "js"}),
            }),
        ]);
    })();
};