import {Route, RouteRule} from "./Route";
import {RouterType} from "./Router";
import {Test, TestRule} from "./Test";


export interface UnTypedRouterRule {
    readonly enabled?: boolean;
    readonly test: Promise<Test<any>>;
    readonly route: Promise<Route>;
}

export interface RouterRule {
    readonly enabled: boolean;
    readonly test: TestRule;
    readonly route: RouteRule;
    readonly type: RouterType;
}