import fetch from "node-fetch";

export const getRawData = async (url: string) => {
	return fetch(url)
		.then((response) => response.text())
		.then((data) => {
			return data;
		});
};

export const formatDateWithoutTimezone = (input: string): Date => {
    const dateWithTimezone = new Date(input);
	const timezoneOffset = dateWithTimezone.getTimezoneOffset() * 60000;
    return new Date((dateWithTimezone as any) - timezoneOffset);
}