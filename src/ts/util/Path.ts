import {path as pathLib} from "./polyfills/path";


export interface Path {
    
    readonly path: string;
    
    readonly filename: string;
    
    readonly extension: string;
    
    readonly fullFilename: string;
    
    append(path: Path): Path;
    
    append(path: string): Path;
    
    absolute(): Path;
    
    toString(): string;
    
}

export const Path = {
    
    of(path: string): Path {
        const {root, dir, base, name, ext} = pathLib.parse(path);
        
        return {
            path: path,
            fullFilename: base,
            filename: name,
            extension: ext.slice(1), // remove leading .
            append: (newPath: Path | string) => Path.of(pathLib.resolve(path, newPath.toString())),
            absolute: () => Path.of(pathLib.resolve(path)),
            toString: () => path,
        };
    },
    
};