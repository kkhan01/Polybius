import {createRef, RefObject} from "react";

export interface NotNullRef<T> extends RefObject<T> {
    
    readonly current: T;
    
}

export const createNotNullRef = function <T>(): NotNullRef<T> {
    return <NotNullRef<T>> createRef();
};