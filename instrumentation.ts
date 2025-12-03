import { type Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
	err,
	request,
	context
) => {
	console.log(err,
			request,
			context,)
	await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report`, {
		method: "POST",
		body: JSON.stringify({
			err,
			request,
			context,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
};
