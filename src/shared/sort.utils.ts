type WithCreatedAt = { createdAt: Date };

export const sortByCreatedAt = (a: WithCreatedAt, b: WithCreatedAt) =>
	a.createdAt.getTime() - b.createdAt.getTime();
export const sortByCreatedAtDesc = (a: WithCreatedAt, b: WithCreatedAt) =>
	b.createdAt.getTime() - a.createdAt.getTime();

type WithUpdatedAt = { updatedAt: Date };
export const sortByUpdatedAt = (a: WithUpdatedAt, b: WithUpdatedAt) =>
	a.updatedAt.getTime() - b.updatedAt.getTime();
export const sortByUpdatedAtDesc = (a: WithUpdatedAt, b: WithUpdatedAt) =>
	b.updatedAt.getTime() - a.updatedAt.getTime();
