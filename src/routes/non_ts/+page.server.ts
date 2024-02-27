import type { PageServerLoad } from './$types';
import { invalidate } from '$app/navigation';
import { getCik, getQtrStats, getTotals } from '$lib/server/db/sqlite';

export const load = async ({ url, depends }) => {
	const limit = Number(url.searchParams.get('limit')) || 5;
	const skip = Number(url.searchParams.get('skip')) || 0;
	const q = url.searchParams.get('q')?.toString() || '';
	const order_by = url.searchParams.get('order_by')?.toString() || 'id';
	const order_dir = url.searchParams.get('order_dir')?.toString() || 'asc';
	const quarter = url.searchParams.get('quarter')?.toString() || '';
	// depends('slider:cik');

	for (const key of url.searchParams.keys()) {
		console.log(key);
	}

	// console.log('quarter:', quarter);

	return {
		ciks: getCik(limit, q, skip, order_by, order_dir),
		qtrStats: await getQtrStats(quarter),
		totals: getTotals()
	};
};
