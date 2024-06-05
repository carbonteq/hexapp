# @carbonteq/hexapp

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
