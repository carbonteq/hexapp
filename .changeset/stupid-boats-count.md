---
"@carbonteq/hexapp": patch
---

Add composition util methods and update AppResult methods for @carbonteq/fp v0.6.0

- Add `AppendToTuple`, `IsUnion` and `EnsureNotUnion` type utils
- Remove `isPromise` type guard. Already present in `node:util/types`
- Add `extractProp`, `extractProps`, `extractId`, `toSerialized` and `nestWithKey` composition utilities
- Rename `RefinedType.$inferInner` to `RefinedType.$inferPrimitive` and `RefinedType.value` to `RefinedType.primitive`
