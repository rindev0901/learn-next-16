import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
	...defaultStatements,
	user: [...defaultStatements.user, "import", "export"],
} as const;

type Permission = {
	readonly [K in keyof typeof statement]?: (typeof statement)[K][number][];
};

const ac = createAccessControl(statement);

const user = ac.newRole({
	user: [],
});

const manager = ac.newRole({
	user: ["create", "get", "list", "update"],
	session: ["list", "revoke"],
});

const admin = ac.newRole({
	...adminAc.statements,
	user: [...statement.user],
});

export { ac, admin, manager, user, type Permission };
