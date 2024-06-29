"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const createSimpleNominal = <sym extends string | symbol, basetype>(
// 	errMsg: string,
// ) => {
// 	type Inner = basetype & Brand.Brand<sym>;
// 	const Constructor = Brand.refined<Inner>(
// 		(t) => typia.is(t),
// 		(t) => Brand.error(errMsg, { value: t }),
// 	);
//
// 	return Constructor;
// };
//
// const UUID = createSimpleNominal<"UUID", string & typia.tags.Format<"uuid">>(
// 	"Not a valid UUID",
// );
// console.debug(UUID(randomUUID()));
//
// console.debug(UUID("foobar"));
// type ZodBrandedWithFactory<
// 	U extends z.ZodTypeAny,
// 	sym extends string | symbol,
// > = z.ZodBranded<U, sym> & {
// 	create: (data: unknown) => Result<U["_output"], Error>;
// };
//
// const refinedWithZod = <sym extends string | symbol, U extends z.ZodTypeAny>(
// 	_tag: sym,
// 	schema: U,
// ): ZodBrandedWithFactory<U, sym> => {
// 	const branded = schema.brand<sym>();
// 	const factory = (s: unknown): Result<U["_output"], Error> => {
// 		const res = branded.safeParse(s);
//
// 		if (res.success) return Result.Ok(res.data);
// 		//TODO: err transformer
// 		return Result.Err(new Error("asdasdad"));
// 	};
//
// 	const finalBranded = branded as ZodBrandedWithFactory<U, sym>;
// 	finalBranded.create = factory;
//
// 	return finalBranded;
// };
//
// const UUID = refinedWithZod("UUID", z.string().uuid());
// type UUID = z.infer<typeof UUID>;
//
// console.debug(UUID.create(randomUUID()));
// console.debug(UUID.create("foobar"));
//
// const nestedSchema = z.object({
// 	id: UUID,
// 	count: z.number(),
// });
//
// console.debug(nestedSchema.safeParse({ id: randomUUID(), count: 2 }));
// console.debug(nestedSchema.safeParse({ id: "foobar", count: 2 }));
//
// const foo = (id: UUID) => {};
//
// foo(randomUUID());
// foo(nestedSchema.parse({ id: randomUUID(), count: 3 }).id);
var extend = function (original, extensions) {
    var res = original;
    //@ts-ignore
    for (var _i = 0, _a = Object.entries(extensions); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        res[k] = v;
    }
    return res;
};
var a = 3;
var res = extend(a, { hello: function () { return "hello"; } });
console.debug(res.hello());
