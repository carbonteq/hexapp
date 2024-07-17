---
"@carbonteq/hexapp": patch
---

Improve refined amd enum types

- Add `$infer` and `$inferInner` for simpler type extraction
- Add `value` method for getting the unbranded type easily
- Add `matchEnum` for pattern matching enum type (with exhaustive checking and type safety)
- Add `eq` 'static' method in enum types for simpler equality checks
