import type { LayoutServerLoad } from './$types';
import { getTotals } from '$lib/server/db/sqlite';

export const load: LayoutServerLoad = async () => {
	return {
		totals: await getTotals()
	};
};
