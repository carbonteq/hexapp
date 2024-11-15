// Faster than .filter(...).map(...) # https://stackoverflow.com/a/47877054/2379922
export const filterMap = <T, U>(
  coll: T[],
  filter: (val: T) => boolean,
  map: (val: T) => U,
): Array<U> => {
  return coll.reduce(
    (acc, curr) => {
      if (filter(curr)) {
        acc.push(map(curr));
      }

      return acc;
    },
    [] as Array<U>,
  );
};

export const mapFilter = <T, U>(
  coll: T[],
  map: (val: T) => U,
  filter: (val: U) => boolean,
): Array<U> => {
  return coll.reduce(
    (acc, curr) => {
      const mapped = map(curr);
      if (filter(mapped)) {
        acc.push(mapped);
      }
      return acc;
    },
    [] as Array<U>,
  );
};

export const randomChoice = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const shuffleInplace = <T>(arr: T[]): T[] => {
  let currIdx = arr.length;
  let randomIdx: number;

  while (currIdx !== 0) {
    randomIdx = Math.floor(Math.random() * currIdx);
    currIdx--;

    const tmp = arr[currIdx];
    arr[currIdx] = arr[randomIdx];
    arr[randomIdx] = tmp;
  }

  return arr;
};

export const shuffle = <T>(arr: T[]): T[] => {
  const toShuffle = [...arr];

  return shuffleInplace(toShuffle);
};

export const counter = <T extends string | number | symbol>(
  arr: T[],
): Record<T, number> => {
  return arr.reduce(
    (acc: Record<T, number>, value: T) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    },
    {} as Record<T, number>,
  );
};

export const extend = <T, U extends Record<string, unknown>>(
  original: T,
  extensions: U,
): T & U => {
  //@ts-expect-error
  return Object.assign(original, extensions);

  // const res = original as T & U;
  // //@ts-ignore
  // for (const [k, v] of Object.entries(extensions)) res[k] = v;
  //
  // return res;
};
