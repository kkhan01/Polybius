import {Mapper} from "./Mapper";

export interface Filter<T> extends Mapper<T, boolean> {

}

export interface AsyncFilter<T> extends Mapper<T, Promise<boolean>> {

}