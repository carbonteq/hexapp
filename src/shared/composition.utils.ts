import type { EnsureNotUnion, IsUnion } from "./type.utils.ts";

export const extractProp =
	<T, K extends keyof T = keyof T>(k: K) =>
	(actual: T): T[K] =>
		actual[k];

/* Create extractor for picking a subset of an object of type T. Not mean to be used as standalone */
export const extractProps =
	<T, K extends (keyof T)[]>(...keys: K) =>
	(obj: T): { [key in K[number]]: T[key] } => {
		const result = {} as { [key in K[number]]: T[key] };

		for (const key of keys) {
			result[key] = obj[key];
		}
		return result;
	};

export const extractId = <Id, T extends { id: Id }>(withId: T): T["id"] =>
	withId.id;

interface Serializable<R> {
	serialize(): R;
}

export const toSerialized = <Serialized>(
	serializable: Serializable<Serialized>,
): Serialized => serializable.serialize();

export const nestWithKey =
	<K extends string, T>(key: EnsureNotUnion<K>) =>
	(obj: T) => {
		type WithKey = IsUnion<K> extends true ? never : { [P in K]: T };
		return { [key]: obj } as WithKey;
	};
