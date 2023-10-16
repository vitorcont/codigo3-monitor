/* eslint-disable @typescript-eslint/no-explicit-any */
export const dateDiff = (initialDate: string, endDate: string) => {
	const dateInit: any = new Date(initialDate);
	const dateEnd: any = new Date(endDate);

	const millisDiff = Math.abs(dateEnd - dateInit);
	const minutesDiff = millisDiff / (1000 * 60);

	return minutesDiff;
};
