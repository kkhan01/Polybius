import {Path} from "../util/Path";
import {Router} from "./Router";
import {storage} from "./Storage";

export const addSampleRules = function(): void {
    // noinspection JSIgnoredPromiseFromCall
    storage.routers.set([
        Router.urlHref.create({
            enabled: true,
            test: /^.*google.*$/i.toSource(),
            route: Path.of("google"),
        }),
        Router.filename.create({
            enabled: true,
            test: "logo",
            route: Path.of("logos"),
        }),
        Router.extension.create({
            enabled: true,
            test: "png",
            route: Path.of("png"),
        }),
        Router.extension.create({
            enabled: true,
            test: "pdf",
            route: Path.of("pdf"),
        }),
    ]);
};