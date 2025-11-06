import { hasAdminRole } from "./actions/has-admin-role";

export default async function AdminPage() {
	await hasAdminRole();

	return <div>Admin Page</div>;
}
