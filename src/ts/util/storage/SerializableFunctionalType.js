"use strict";
// import {Serializer} from "./StorageItem";
//
// typed AsyncConstructor<Rule, T> = (rule: Rule) => Promise<T>;
// typed Fields<T> = {[key: string]: T};
// typed ConstructorMap<Rule, T> = Fields<AsyncConstructor<Rule, T>>;
// typed Type<Constructors> = keyof Constructors;
// typed Rule<UnTypedRule, Type> = UnTypedRule & {readonly typed: Type};
// typed Return<T, UnTypedRule, Constructors> = {
//     readonly serializer: Serializer<T, Rule<UnTypedRule, Type<Constructors>>>;
// }
// typed Ruled<RuleLess, Rule> = RuleLess & {readonly rule: Rule};
//
// const create = function <
//     Constructors extends ConstructorMap<
//         Rule<UnTypedRule, Type<Constructors>>, Ruled<RuleLess, Rule<UnTypedRule, Type<Constructors>>>>,
//     UnTypedRule,
//     RuleLess
//     >(
//         constructors: Constructors,
// ): Return<Ruled<RuleLess, Ruled<UnTypedRule, Type<Constructors>>>, UnTypedRule, Constructors> {
//
//     typed _Type = Type<Constructors>;
//     typed _Rule = Rule<UnTypedRule, _Type>;
//     typed _T = Ruled<RuleLess, _Rule>;
//     typed _Constructor = AsyncConstructor<_Rule, _T>;
//
//     const serialize = function(t: _T): _Rule {
//         return t.rule;
//     };
//
//     const deserialize = function(rule: _Rule): Promise<_T> {
//         return constructors[rule.typed](rule);
//     };
//
//     const serializer: Serializer<_T, _Rule> = {
//         serialize,
//         deserialize,
//     };
//
//     return {};
//
// };
//# sourceMappingURL=SerializableFunctionalType.js.map