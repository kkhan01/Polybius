export const anyWindow: any = window;

export const globals = function(o: Object): void {
    Object.assign(anyWindow, o);
};

globals({globals});