export type IfElse<Bool extends boolean, True, False> = Bool extends true ? True : False;

export type If<Bool extends boolean, True> = IfElse<Bool, True, never>;