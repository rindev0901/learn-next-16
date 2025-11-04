import { useParams } from "next/navigation";

export function useLocale() {
	const params = useParams<{ lang: string }>();
	return params.lang;
}
