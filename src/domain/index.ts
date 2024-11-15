export { BaseEntity } from "./base.entity.js";
export type {
  IEntity,
  IEntityForUpdate,
  SerializedEntity,
  SimpleSerialized,
} from "./base.entity.ts";
export {
  InvalidEmail,
  UUID,
  InvalidDateTime,
  Email,
  DateTime,
  createRefinedType,
  createEnumType,
  matchEnum,
  EnumValidationError,
  InvalidUUID,
  type Unbrand,
} from "./refined.types.js";
export { AggregateRoot } from "./aggregate-root.entity.js";
export {
  BaseValueObject,
  DateRange,
  InvalidDateRange,
} from "./base.vo.js";
export type { IDateRange } from "./base.vo.ts";
export {
  AlreadyExistsError,
  DomainError,
  GenericDomainError,
  GuardViolationError,
  InvalidOperation,
  NotFoundError,
  UnauthorizedOperation,
  ValidationError,
} from "./base.errors.js";
export type { DomainErr } from "./base.errors.ts";
export { BaseRepository } from "./base.repository.js";
export type {
  RepositoryError,
  RepositoryResult,
} from "./base.repository.ts";
export {
  PaginationOptions,
  Paginator,
  PaginationOptionsValidationError,
} from "./pagination.js";
export type { Paginated } from "./pagination.ts";
