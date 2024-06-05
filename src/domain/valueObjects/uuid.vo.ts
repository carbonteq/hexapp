import { randomUUID } from "node:crypto";
import type { Result } from "@carbonteq/fp";
import { z } from "zod";
import { ZodUtils } from "../../shared/zod.utils";
import { ValidationError } from "../base.errors";
import { BaseValueObject } from "./base.vo";

export class InvalidUUID extends ValidationError {
	constructor(uuid_str: string) {
		super(`Invalid UUID <${uuid_str}>`);
	}
}

export class UUIDVo extends BaseValueObject<string> {
	private constructor(private readonly uuid: string) {
		super();
	}

	static new(): UUIDVo {
		const uuid_str = randomUUID();

		return new UUIDVo(uuid_str);
	}

	static fromStrNoValidation(uuid: string): UUIDVo {
		return new UUIDVo(uuid);
	}

	static fromStr(uuidCandidate: string): Result<UUIDVo, InvalidUUID> {
		return ZodUtils.safeParseResult(
			UUID_SCHEMA,
			uuidCandidate,
			(_) => new InvalidUUID(uuidCandidate),
		);
	}

	serialize(): string {
		return this.uuid;
	}
}

export const UUID_SCHEMA = z
	.string()
	.uuid()
	.transform<UUIDVo>(UUIDVo.fromStrNoValidation);
