import { BaseEntity } from "./dist/domain/base.entity";

class Ent extends BaseEntity {
	// biome-ignore lint/complexity/noUselessConstructor: <explanation>
	constructor() {
		super();
	}

	serialize() {
		return {
			...super._serialize(),
		};
	}
}

const ent = new Ent();
console.debug(ent.serialize());
