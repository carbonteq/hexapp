---
"@carbonteq/hexapp": minor
---

- Add nominal/branded types (and a helper function to simplify their creation)
- Remove ExternalServiceFailure error port
- Add GuardViolationError and AppErrStatus
- Simplify BaseRepository, only insert and update are mandatory to implement now
- Remove UUID and Email value objects, shift to UUID and Email branded types
- Simplify types in SerializedEntity interface (can reuse UUID in both IEntity and SerializedEntity)
- Move Logger interface to shared
- Move MockRepository to infra
- Remove EMAIL and UUID schema types from ZodSchemas
- Update tests to cater to above changes, add new tests for nominal types
