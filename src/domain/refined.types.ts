import { randomUUID } from "node:crypto";
import { Result } from "@carbonteq/fp";
import z, { type ZodEnum, type ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { extend } from "../shared/misc.utils.js";
import { unsafeCast } from "../shared/type.utils.js";
import { type DomainError, ValidationError } from "./base.errors.js";

// type OverwriteValueOf<T, Schema extends z.ZodTypeAny> = Omit<T, "valueOf"> & {
// 	valueOf(): Schema["_output"];
// };
type Extensions<
  Schema extends z.ZodTypeAny,
  Tag extends string | symbol,
  Err extends DomainError,
> = {
  create: (data: unknown) => Result<Schema["_output"] & z.BRAND<Tag>, Err>;
  $infer: Schema["_output"] & z.BRAND<Tag>;
  $inferPrimitive: Schema["_output"];
  primitive(branded: Schema["_output"] & z.BRAND<Tag>): Schema["_output"];
};

type ZodBrandedWithFactory<
  Schema extends z.ZodTypeAny,
  Tag extends string | symbol,
  Err extends DomainError,
> = z.ZodBranded<Schema, Tag> & Extensions<Schema, Tag, Err>;

const defaultFromZodErr = (_data: unknown, err: z.ZodError) =>
  new ValidationError(fromZodError(err).message);

export function createRefinedType<
  Tag extends string | symbol,
  Schema extends z.ZodTypeAny,
>(
  _tag: Tag,
  schema: Schema,
): ZodBrandedWithFactory<Schema, Tag, ValidationError>;
export function createRefinedType<
  Tag extends string | symbol,
  Schema extends z.ZodTypeAny,
  Err extends DomainError,
>(
  _tag: Tag,
  schema: Schema,
  errTransformer: (data: Schema["_input"], err: z.ZodError) => Err,
): ZodBrandedWithFactory<Schema, Tag, Err>;
export function createRefinedType<
  sym extends string | symbol,
  U extends z.ZodTypeAny,
  E extends DomainError,
>(
  tag: sym,
  schema: U,
  errConst?: (data: U["_input"], err: z.ZodError) => E,
): ZodBrandedWithFactory<U, sym, E> {
  const errTransformer = errConst ?? defaultFromZodErr;
  const branded = schema.brand<sym>();

  const factory = (data: unknown): Result<U["_output"], E> => {
    const res = branded.safeParse(data);

    if (res.success) return Result.Ok(res.data);
    const err = errTransformer(data, res.error) as E;
    return Result.Err(err);
  };

  const extensions: Extensions<U, sym, E> = {
    create: factory,
    //@ts-expect-error
    $infer: tag,
    $inferPrimitive: tag,
    // get $infer(): U["_output"] & z.BRAND<sym> {
    // 	throw new Error("$infer not meant to be called at runtime");
    // },
    // get $inferInner(): U["_output"] {
    // 	throw new Error("$inferInner not meant to be called at runtime");
    // },
    primitive(branded) {
      return branded;
    },
  };
  const finalBranded = extend(branded, extensions);

  return finalBranded;
}

export type Unbrand<T> = T extends z.ZodType<unknown, z.ZodTypeDef, infer U>
  ? U
  : T;

export class InvalidUUID extends ValidationError {
  constructor(data: unknown) {
    super(`Invalid UUID: ${data}`);
  }
}

// Example of how to use refined branded types with Zod
// Custom error type not mandatory
export class InvalidEmail extends ValidationError {
  constructor(data: unknown) {
    super(`Invalid Email: ${data}`);
  }
}

type TEmail = ZodBrandedWithFactory<z.ZodString, "Email", InvalidEmail>;
export const Email: TEmail = createRefinedType(
  "Email",
  z.string().email(),

  (data, _err) => new InvalidEmail(data),
);
export type Email = typeof Email.$infer;

// Not a good example as I wanted to add some custom stuff
type TUUIDSchema = z.ZodString;
type TUUIDInner = ZodBrandedWithFactory<TUUIDSchema, "UUID", InvalidUUID>;
const UUIDInner: TUUIDInner = createRefinedType(
  "UUID",
  z.string().uuid(),
  (data, _err) => new InvalidUUID(data),
);
export type UUID = typeof UUIDInner.$infer;
type TUUID = TUUIDInner & {
  init: () => UUID;
  fromTrusted: (s: string) => UUID;
};
export const UUID: TUUID = extend(UUIDInner, {
  init: () => randomUUID() as UUID,
  fromTrusted: unsafeCast<UUID, string>,
});

export class InvalidDateTime extends ValidationError {
  constructor(data: unknown) {
    super(`Invalid DateTime: ${data}`);
  }
}

type TDTInnerSchema = z.ZodPipeline<
  z.ZodUnion<[z.ZodNumber, z.ZodString, z.ZodDate]>,
  z.ZodDate
>;
type TDTInner = ZodBrandedWithFactory<
  TDTInnerSchema,
  "DateTime",
  InvalidDateTime
>;
const DTInner: TDTInner = createRefinedType(
  "DateTime",
  z.union([z.number(), z.string(), z.date()]).pipe(z.coerce.date()),
  (data, _err) => new InvalidDateTime(data),
);
export type DateTime = typeof DTInner.$infer;
type TDateTime = TDTInner & {
  now: () => DateTime;
  from: (d: Date | DateTime) => DateTime;
};
export const DateTime: TDateTime = extend(DTInner, {
  now: () => new Date() as DateTime,
  from: unsafeCast<DateTime, Date | DateTime>,
});

// Enum types
export class EnumValidationError extends ValidationError {
  constructor(
    readonly tag: string | symbol,
    msg: string,
    readonly data: unknown,
    readonly err: ZodError,
  ) {
    super(msg);
  }
}

type EnumTypeUtil<
  Tag extends string | symbol,
  U extends string,
  T extends [U, ...U[]],
> = ZodBrandedWithFactory<
  z.ZodEnum<z.Writeable<T>>,
  Tag,
  EnumValidationError
> & {
  from: (v: T[number]) => z.Writeable<T>[number] & z.BRAND<Tag>;
  values: Readonly<T>;
  eq: (
    a: T[number] | (T[number] & z.BRAND<Tag>),
    b: T[number] | (T[number] & z.BRAND<Tag>),
  ) => boolean;
};

export const createEnumType = <
  Tag extends string | symbol,
  U extends string,
  T extends [U, ...U[]],
>(
  tag: Tag,
  enumValues: T,
): EnumTypeUtil<Tag, U, T> => {
  type InnerType = ZodBrandedWithFactory<
    z.ZodEnum<z.Writeable<T>>,
    Tag,
    EnumValidationError
  >;
  const innerType: InnerType = createRefinedType(
    tag,
    z.enum(enumValues),
    (data, err) =>
      new EnumValidationError(
        tag,
        `<${data.valueOf()}> must be one of ${enumValues.valueOf()}`,
        data,
        err,
      ),
  );

  type ExtendedType = InnerType & {
    from: (v: T[number]) => z.Writeable<T>[number] & z.BRAND<Tag>;
    values: Readonly<T>;
    eq: (
      a: T[number] | (T[number] & z.BRAND<Tag>),
      b: T[number] | (T[number] & z.BRAND<Tag>),
    ) => boolean;
  };

  const extended: ExtendedType = extend(innerType, {
    from: unsafeCast<typeof innerType.$infer, T[number]>,
    get values(): Readonly<T> {
      return enumValues;
    },
    eq(
      a: T[number] | (T[number] & z.BRAND<Tag>),
      b: T[number] | (T[number] & z.BRAND<Tag>),
    ): boolean {
      return a === b;
    },
  });

  return extended;
};

type MatchActions<T extends string | symbol | number, R> = {
  [K in T]: () => R;
};

export function matchEnum<
  Tag extends string | symbol,
  U extends string,
  T extends [U, ...U[]],
  EnumType extends ZodBrandedWithFactory<ZodEnum<T>, Tag, EnumValidationError>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Actions extends MatchActions<EnumType["$inferPrimitive"], any>,
>(
  value: EnumType["$infer"],
  _enumType: EnumType,
  actions: Actions,
): ReturnType<Actions[EnumType["$inferPrimitive"]]> {
  const key = value as unknown as keyof typeof actions;
  if (key in actions) {
    return actions[key]();
  }
  throw new Error(`Unhandled enum value: ${value.valueOf()}`);
}
