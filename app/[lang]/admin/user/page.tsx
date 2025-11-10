import { hasPermission } from "@/lang/admin/actions/has-permission";
import { forbidden } from "next/navigation";

export default async function UserPage() {
	const { error } = await hasPermission({ user: ["list"] });
	if (error) {
		forbidden();
	}

	return <div>User Page</div>;
}
