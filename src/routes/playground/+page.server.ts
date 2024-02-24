import type { PageServerLoad } from './$types';
import { getCik, getQtrStats, getTotals } from '$lib/server/db/sqlite';

const quarters = ['1999Q1', '1999Q2', '1999Q3', '2001Q3', '2023Q1'];

export const load = async ({ url }) => {
	const limit = Number(url.searchParams.get('limit')) || 5;
	const skip = Number(url.searchParams.get('skip')) || 0;
	const q = url.searchParams.get('q')?.toString() || '';
	const order_by = url.searchParams.get('order_by')?.toString() || 'id';
	const order_dir = url.searchParams.get('order_dir')?.toString() || 'asc';

	console.log('q', q);

	return {
		ciks: getCik(limit, q, skip, order_by, order_dir),
		qtrStats: await getQtrStats(),
		totals: await getTotals(),
		quarters
	};
};
