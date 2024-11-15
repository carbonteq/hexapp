import type { GetKeysWithSpecificTypeValue } from "./type.utils.ts";

type WithCreatedAt = { createdAt: Date };

export const sortByCreatedAt = (a: WithCreatedAt, b: WithCreatedAt): number =>
  a.createdAt.getTime() - b.createdAt.getTime();
export const sortByCreatedAtDesc = (
  a: WithCreatedAt,
  b: WithCreatedAt,
): number => b.createdAt.getTime() - a.createdAt.getTime();

type WithUpdatedAt = { updatedAt: Date };
export const sortByUpdatedAt = (a: WithUpdatedAt, b: WithUpdatedAt): number =>
  a.updatedAt.getTime() - b.updatedAt.getTime();
export const sortByUpdatedAtDesc = (
  a: WithUpdatedAt,
  b: WithUpdatedAt,
): number => b.updatedAt.getTime() - a.updatedAt.getTime();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const sortByDatesAsc = <T extends Record<string, any>>(
  arr: T[],
  dateKey: GetKeysWithSpecificTypeValue<T, Date>,
): T[] => arr.sort((a, b) => a[dateKey].getTime() - b[dateKey].getTime());

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const sortByDatesDesc = <T extends Record<string, any>>(
  arr: T[],
  dateKey: GetKeysWithSpecificTypeValue<T, Date>,
): T[] => arr.sort((a, b) => b[dateKey].getTime() - a[dateKey].getTime());

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const sortByDates = <T extends Record<string, any>>(
  arr: T[],
  dateKey: GetKeysWithSpecificTypeValue<T, Date>,
  order: "ASC" | "DESC",
): T[] =>
  order === "ASC"
    ? sortByDatesAsc(arr, dateKey)
    : sortByDatesDesc(arr, dateKey);
