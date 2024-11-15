# @carbonteq/hexapp

## 0.19.1

### Patch Changes

- f9bf649: empty

## 0.19.0

### Minor Changes

- cbd1c1c: - Rename nominal types to refined types
  - Add `extend` util for adding custom method to an object or class while retaining type safety (an alternative is spread operator, but that approach removes the runtime private props)
  - Add `DateTime` refined type
  - Add an optionally implementable `getParser` method in `BaseValueObject` to allow sharing schematic (syntactic + semantic) validation logic with domain boundaries
  - Add a `DateRange` type to show case how to use refined types and the structure of a value object with schematic and domain validations
  - Update `BaseEntity` to utilize the new refined types for `Id` (`UUID`), `createdAt` (`DateTime`) and `updatedAt` (`DateTime`) fields
- 9686ab1: - Add nominal/branded types (and a helper function to simplify their creation)
  - Remove ExternalServiceFailure error port
  - Add GuardViolationError and AppErrStatus
  - Simplify BaseRepository, only insert and update are mandatory to implement now
  - Remove UUID and Email value objects, shift to UUID and Email branded types
  - Simplify types in SerializedEntity interface (can reuse UUID in both IEntity and SerializedEntity)
  - Move Logger interface to shared
  - Move MockRepository to infra
  - Remove EMAIL and UUID schema types from ZodSchemas
  - Update tests to cater to above changes, add new tests for nominal types

### Patch Changes

- 1dfa48a: Add values getter to refined enums
- 7482c4c: Simplify serialized entity

## 0.18.3

### Patch Changes

- 669ff67: Add composition util methods and update AppResult methods for @carbonteq/fp v0.6.0

  - Add `AppendToTuple`, `IsUnion` and `EnsureNotUnion` type utils
  - Remove `isPromise` type guard. Already present in `node:util/types`
  - Add `extractProp`, `extractProps`, `extractId`, `toSerialized` and `nestWithKey` composition utilities
  - Rename `RefinedType.$inferInner` to `RefinedType.$inferPrimitive` and `RefinedType.value` to `RefinedType.primitive`

## 0.18.2

### Patch Changes

- 261f5fd: Improve refined amd enum types

  - Add `$infer` and `$inferInner` for simpler type extraction
  - Add `value` method for getting the unbranded type easily
  - Add `matchEnum` for pattern matching enum type (with exhaustive checking and type safety)
  - Add `eq` 'static' method in enum types for simpler equality checks

## 0.18.1

### Patch Changes

- 759d906: Simplify app error messages

## 0.18.0

### Minor Changes

- cbd1c1c: - Rename nominal types to refined types
  - Add `extend` util for adding custom method to an object or class while retaining type safety (an alternative is spread operator, but that approach removes the runtime private props)
  - Add `DateTime` refined type
  - Add an optionally implementable `getParser` method in `BaseValueObject` to allow sharing schematic (syntactic + semantic) validation logic with domain boundaries
  - Add a `DateRange` type to show case how to use refined types and the structure of a value object with schematic and domain validations
  - Update `BaseEntity` to utilize the new refined types for `Id` (`UUID`), `createdAt` (`DateTime`) and `updatedAt` (`DateTime`) fields
- 9686ab1: - Add nominal/branded types (and a helper function to simplify their creation)
  - Remove ExternalServiceFailure error port
  - Add GuardViolationError and AppErrStatus
  - Simplify BaseRepository, only insert and update are mandatory to implement now
  - Remove UUID and Email value objects, shift to UUID and Email branded types
  - Simplify types in SerializedEntity interface (can reuse UUID in both IEntity and SerializedEntity)
  - Move Logger interface to shared
  - Move MockRepository to infra
  - Remove EMAIL and UUID schema types from ZodSchemas
  - Update tests to cater to above changes, add new tests for nominal types

### Patch Changes

- 1dfa48a: Add values getter to refined enums
- 7482c4c: Simplify serialized entity

## 0.17.2

### Patch Changes

- cc3ce7d: Dummy release with fixed exports

## 0.17.1

### Patch Changes

- a18e818: Add createEnumType, update to use @carbonteq/fp@0.5.0. Add isPromise type guard

## 0.17.0

### Minor Changes

- cbd1c1c: - Rename nominal types to refined types
  - Add `extend` util for adding custom method to an object or class while retaining type safety (an alternative is spread operator, but that approach removes the runtime private props)
  - Add `DateTime` refined type
  - Add an optionally implementable `getParser` method in `BaseValueObject` to allow sharing schematic (syntactic + semantic) validation logic with domain boundaries
  - Add a `DateRange` type to show case how to use refined types and the structure of a value object with schematic and domain validations
  - Update `BaseEntity` to utilize the new refined types for `Id` (`UUID`), `createdAt` (`DateTime`) and `updatedAt` (`DateTime`) fields
- 9686ab1: - Add nominal/branded types (and a helper function to simplify their creation)
  - Remove ExternalServiceFailure error port
  - Add GuardViolationError and AppErrStatus
  - Simplify BaseRepository, only insert and update are mandatory to implement now
  - Remove UUID and Email value objects, shift to UUID and Email branded types
  - Simplify types in SerializedEntity interface (can reuse UUID in both IEntity and SerializedEntity)
  - Move Logger interface to shared
  - Move MockRepository to infra
  - Remove EMAIL and UUID schema types from ZodSchemas
  - Update tests to cater to above changes, add new tests for nominal types

### Patch Changes

- 7482c4c: Simplify serialized entity

## 0.16.1

### Patch Changes

- cdd733d: Update to @carbonteq/fp version 0.4.0

## 0.16.0

### Minor Changes

- cbd1c1c: - Rename nominal types to refined types
  - Add `extend` util for adding custom method to an object or class while retaining type safety (an alternative is spread operator, but that approach removes the runtime private props)
  - Add `DateTime` refined type
  - Add an optionally implementable `getParser` method in `BaseValueObject` to allow sharing schematic (syntactic + semantic) validation logic with domain boundaries
  - Add a `DateRange` type to show case how to use refined types and the structure of a value object with schematic and domain validations
  - Update `BaseEntity` to utilize the new refined types for `Id` (`UUID`), `createdAt` (`DateTime`) and `updatedAt` (`DateTime`) fields
- 9686ab1: - Add nominal/branded types (and a helper function to simplify their creation)
  - Remove ExternalServiceFailure error port
  - Add GuardViolationError and AppErrStatus
  - Simplify BaseRepository, only insert and update are mandatory to implement now
  - Remove UUID and Email value objects, shift to UUID and Email branded types
  - Simplify types in SerializedEntity interface (can reuse UUID in both IEntity and SerializedEntity)
  - Move Logger interface to shared
  - Move MockRepository to infra
  - Remove EMAIL and UUID schema types from ZodSchemas
  - Update tests to cater to above changes, add new tests for nominal types

### Patch Changes

- 9f66ba9: Add offset to pagination

## 0.15.0

### Minor Changes

- 4cd4a51: Add utils

## 0.14.1

### Patch Changes

- baf4dc7: Fix export for handleZodError

## 0.14.0

### Minor Changes

- 375b949: Upgrade zod utils

### Patch Changes

- 06a705f: Pagination API RC
- d0569b7: Update rollup to version 4

## 0.13.2

### Patch Changes

- 592ff0c: Remove existsById from BaseRepository
- f76700d: Add JSON_SCHEMA to ZodSchemas

## 0.13.1

### Patch Changes

- fc5bcb6: Update @carbonteq/fp version

## 0.13.0

### Minor Changes

- 28a5cf2: Add ValueObjects and Zod utilities

## 0.12.3

### Patch Changes

- 57b3369: Use unit from @ct/fp and add Omitt type util

## 0.12.2

### Patch Changes

- a9a3455: Fix exports

## 0.12.1

### Patch Changes

- 65fa1fb: Add UUID value object

## 0.12.0

### Minor Changes

- 56b595c: Use @carbonteq/fp instead of oxide

## 0.11.0

### Minor Changes

- c72a6c9: Add zipF and zipFAsync utils

## 0.10.2

### Patch Changes

- 014058a: Add toResult util for DtoValidationResult

## 0.10.1

### Patch Changes

- 26e5a5b: add fromErr for DtoValidationResult

## 0.10.0

### Minor Changes

- 64ab2ef: DtoValidationResult is now a proper class, not a type alias

## 0.9.4

### Patch Changes

- b113ba6: Update zod version to fix type error due to incompatibility

## 0.9.3

### Patch Changes

- c12f131: Use safe parse in dto validation

## 0.9.2

### Patch Changes

- 1474577: Update monadic bind func type inference
- 41dc3e0: Update repo default errors to include InvalidOperation

## 0.9.1

### Patch Changes

- f5c89e4: Add log method to logger interface

## 0.9.0

### Minor Changes

- 4e828eb: Updates to AppResult and addition of Base DTO

## 0.8.2

### Patch Changes

- c6bfa5f: Remove type arg from UnitResult

## 0.8.1

### Patch Changes

- 546d251: Fix exports for MonadicUtils

## 0.8.0

### Minor Changes

- 285d4e3: Add monadic utils, UnitResult, and fix AppResult.fromOther

### Patch Changes

- 00b665b: Default impls for byId methods in ExtendedRepo. existsBy returns RepoResult now

## 0.7.1

### Patch Changes

- 47023ec: Add default type argument to repo result

## 0.7.0

### Minor Changes

- b43f3b6: Add BaseDTO

### Patch Changes

- cd3fef0: Polish AppResult further and add mock repository for testing

## 0.6.1

### Patch Changes

- 15f7367: add emptyobject type
- dc0496d: add ExternalServiceFailure error

## 0.6.0

### Minor Changes

- 891c493: cleanup app result api
- 98a3b98: Add copyBaseProps method to BaseEntity
- 759af93: update to rollup v3
- 0d42ab6: Update module type to nodenext

## 0.5.0

### Minor Changes

- db221c6: Add express middleware and update dependencies

### Patch Changes

- cc6a637: Update tooling (rome, node, yarn)

  - Rome used for linting and formatting instead of eslint + prettier
  - Node now at 18.x (lts-hydrogen)
  - Update npm and yarn versions accordingly

## 0.4.1

### Patch Changes

- 9d83072: Fix: Import from oxide.ts directly to avoid import error in index.js

## 0.4.0

### Minor Changes

- 2041498: Allow AppResult Err to include messages

## 0.3.0

### Minor Changes

- 6aa77da: Add finish domain utils (tentative)

### Patch Changes

- d0d49cf: Add BaseRepository (w/o Result)

## 0.2.1

### Patch Changes

- 00936cc: add serialize method to Base Entity
- 0bc8c3d: Make markUpdated protected in BaseEntity

## 0.2.0

### Minor Changes

- 9bc7aee: Add base entity and tests

## 0.1.0

### Minor Changes

- 31f5c0e: Rename to hexapp. Update structure
- 1eab7c0: Add optional error transformer arg to tryFrom and tryFromPromise
- f535850: Add constructors tryFrom and tryFromPromise

### Patch Changes

- 3ca229c: Initial structure. Very tentative
