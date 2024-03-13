import {
	getCik,
	getQtrStats,
	getQuarters,
	getTopTenCikTwrrYahoo,
	getTopTenCikValue
} from '$lib/server/db/sqlite';

const uniqueQuartersList = getQuarters().map((row: any) => row.quarter);
const maxQuarter = uniqueQuartersList.at(-1);
const maxQuarterIndex = uniqueQuartersList.indexOf(maxQuarter);

export const load = async ({ url }) => {
	const limit = Number(url.searchParams.get('limit')) || 7;
	const skip = Number(url.searchParams.get('skip')) || 0;
	const q = url.searchParams.get('q')?.toString() || '';
	const order_by = url.searchParams.get('order_by')?.toString() || 'id';
	const order_dir = url.searchParams.get('order_dir')?.toString() || 'asc';

	const ciks = getCik(limit, q, skip, order_by, order_dir);

	console.log('q', q);
	/////////////////////////////////////////
	let quarter_id = url.searchParams.get('quarter_id') || maxQuarterIndex;
	console.log(`quarter_id: ${quarter_id}`);
	let quarter = uniqueQuartersList[+quarter_id] || maxQuarter;
	console.log(`From +page.server.ts - var quarter_id: ${quarter_id}`);
	console.log(`From +page.server.ts - var quarter: ${quarter}`);
	console.log(`////////////////////////////////////////////`);
	const top_10_ciks_twrr_yahoo = getTopTenCikTwrrYahoo(quarter);
	const top_10_ciks_value = getTopTenCikValue(quarter);

	return {
		ciks: ciks,
		qtrStats: getQtrStats(),
		top_10_ciks_twrr_yahoo: top_10_ciks_twrr_yahoo,
		top_10_ciks_value: top_10_ciks_value,
		quarter_id,
		quarter,
		quarters: uniqueQuartersList
	};
};
