# @carbonteq/hexapp

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
