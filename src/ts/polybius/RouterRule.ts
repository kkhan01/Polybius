import {Path} from "../util/Path";
import {RouterType} from "./Router";


export interface UnTypedRouterRule {
    
    readonly enabled: boolean;
    
    readonly test: string;
    
    readonly route: Path;
    
}

export interface RouterRule extends UnTypedRouterRule {
    
    readonly type: RouterType;
    
}