---
"@carbonteq/hexapp": patch
---

It adds GuardViolationError and GenericDomainError to the AppError class so that when using AppResult.fromResult, the exact error status is preserved, allowing users to map different status codes in their result interceptors and related logic.
