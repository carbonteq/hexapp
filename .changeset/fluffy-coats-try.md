---
"@carbonteq/hexapp": minor
---

- Rename nominal types to refined types
- Add `extend` util for adding custom method to an object or class while retaining type safety (an alternative is spread operator, but that approach removes the runtime private props)
- Add `DateTime` refined type
- Add an optionally implementable `getParser` method in `BaseValueObject` to allow sharing schematic (syntactic + semantic) validation logic with domain boundaries
- Add a `DateRange` type to show case how to use refined types and the structure of a value object with schematic and domain validations
- Update `BaseEntity` to utilize the new refined types for `Id` (`UUID`), `createdAt` (`DateTime`) and `updatedAt` (`DateTime`) fields
