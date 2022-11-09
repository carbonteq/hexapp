import type { AppResult } from '@carbonteq/hexapp/app/result';

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| Date
	| JsonValue[]
	| { [k: string]: JsonValue }; // JsonObject

export type JsonObject = { [x: string]: JsonValue };

export type JsonGuard<T> = T extends JsonValue ? T : never;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Constructable<T> = new (...args: unknown[]) => T;
// export interface Type<T> extends Function {
//   new (...args: any[]): T;
// }

export type ExtractPromiseType<T extends Promise<any>> = T extends Promise<
	infer X
>
	? X
	: never;

export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> =
	T extends (...args: any[]) => Promise<infer R> ? R : never; // may replace never with any

export type ExtractAppResultVal<T extends AppResult<any>> = T extends AppResult<
	infer X
>
	? X
	: never;

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
