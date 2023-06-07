export const stringifyFunc = (f: Function): string => {
  const methodName = f.name;
  if (f.prototype?.constructor?.name) {
    const className = f.prototype.constructor.name;

    return `${className}.${methodName}`;
  } else {
    return methodName;
  }
};
