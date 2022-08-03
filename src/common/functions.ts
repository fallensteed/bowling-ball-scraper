import fetch from "node-fetch";

export const getRawData = async (url: string) => {
	return fetch(url)
		.then((response) => response.text())
		.then((data) => {
			return data;
		});
};
