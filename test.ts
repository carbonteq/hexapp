import { BaseEntity } from "./dist/index.js";

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
