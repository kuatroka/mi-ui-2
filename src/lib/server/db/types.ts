export type QtrStats = {
	quarter_end_date: string;
	quarter: string;
	ttl_value_all_ciks_per_qtr: number;
	ttl_num_ciks_per_qtr: number;
	ttl_num_assets_all_ciks_per_qtr: number;
	ttl_num_positions_per_qtr: number;
	open_close_ratio: number;
	num_stopped_ciks: number;
	num_new_ciks: number;
	mean_curr_twrr_all_ciks_per_qtr_cons: number;
	mean_curr_twrr_all_ciks_per_qtr_yahoo: number;
	is_quarter_completed: string;
};

export type Totals = {
	ttl_ciks: number;
	ttl_assets: number;
	ttl_years: number;
	ttl_quarters: number;
	ttl_positions: number;
	last_full_qtr: number;
	last_full_value: number;
};

export type Charachter = {
	id: number;
	name: string;
	image: string;
	occupation: string;
};

export type Cik = {
	num_entries: number;
	id: number;
	cik: string;
	cik_name: string;
	cum_twrr_cons: number;
	cum_twrr_yahoo: number;
	value: number;
	quarter: string;
};

export type CikDetails = {
	cik: string;
	cik_name: string;
	cik_ticker: string;
	cik_ticker_name: string;
	cum_twrr: number;
	curr_twrr: number;
	num_assets: number;
	value: number;
	quarter: string;
	link: string;
};
