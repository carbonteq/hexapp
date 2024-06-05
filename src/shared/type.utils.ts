import type { AppResult } from "..//app/result";

export type EmptyObject = Record<string, never>;

type JsonValue =
	| string
	| number
	| boolean
	| null
	| Date
	| JsonValue[]
	| { [k: string]: JsonValue }; // JsonObject

type JsonObject = { [x: string]: JsonValue };
type JsonGuard<T> = T extends JsonValue ? T : never;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Omitt<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Constructable<T> = new (...args: unknown[]) => T;

export type ExtractAppResultType<U> = U extends AppResult<infer X> ? X : never;

export type ArrType<T> = T extends Array<infer R> ? R : never;
export type IterType<T> = T extends { [Symbol.iterator](): infer I }
	? I
	: never;

export type InferAppResult<
	T extends (...args: unknown[]) => Promise<AppResult<unknown>>,
> = ExtractAppResultType<Awaited<ReturnType<T>>>;

// BETTER TO COMPOSE THE UTILITIES LISTED ABOVE

// export type ExtractAsyncAppResultVal<
//   T extends (...args: any[]) => Promise<AppResult<any>>,
// > = ExtractAppResultVal<AsyncReturnType<T>>;
//
// export type ExtractAppResultAsyncVal<
//   T extends (...args: any[]) => AppResult<Promise<any>>,
// > = ExtractAppResultVal<ReturnType<T>>;
//
// ------------------------------------------------------------------------

/**
 * Is used to ensure that all cases are handled in a switch statement. Throws error on runtime
 * @internal
 * @see https://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checking
 *
 * @param x {never} - This is a type that should never be used. It is used to ensure that the switch statement is exhaustive.
 */
export const assertUnreachable = (x: never): never => {
	throw new Error(`Unexpected object: ${x}`);
};

/**
 * Is used to ensure that all cases are handled in a switch statement. Passes through the value on runtime
 * @internal
 * @see https://www.typescriptlang.org/docs/handbook/advanced-types.html#exhaustiveness-checking
 *
 * @param x {never} - This is a type that should never be used. It is used to ensure that the switch statement is exhaustive.
 */
export const assertUnreachablePassthrough = (x: never): never => x;
