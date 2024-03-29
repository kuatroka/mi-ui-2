export type QtrStats = {
	quarter_end_date: string;
	quarter: string;
	ttl_value_all_ciks_per_qtr: number;
	ttl_num_ciks_per_qtr: number;
	ttl_num_assets_all_ciks_per_qtr: number;
	ttl_num_positions_per_qtr: number;
	open_positions_per_qtr: number;
	close_positions_per_qtr: number;
	open_close_ratio: number;
	num_stopped_ciks: number;
	ratio_new_stopped_ciks: number;
	num_new_ciks: number;
	mean_curr_twrr_all_ciks_per_qtr_cons: number;
	qtr_return_yahoo: number;
	compound_return_yahoo: number;
	is_quarter_completed: string;
	num_stopped_cusips: string;
	num_new_cusips: string;
	ratio_new_stopped_cusips: string;
};

export type Totals = {
	ttl_ciks: number;
	ttl_assets: number;
	ttl_years: number;
	ttl_quarters: number;
	ttl_positions: number;
	incomplete_qtr: string;
	last_full_qtr: number;
	last_full_value: number;
	last_compound_twrr: number;
	last_curr_twrr: number;
	last_load_date: string;
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
	qtr_return_yahoo: number;
	value: number;
	num_assets: number;
	quarter: string;
	active_from: string;
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

export type TopTenCikTwrrYahoo = {
	cik: string;
	cik_name: string;
	quarter: string;
	quarter_end_date: string;
	cum_twrr_yahoo: number;
	// rank_cum_twrr_yahoo: string;
};

export type TopTenCikValue = {
	cik: string;
	cik_name: string;
	quarter: string;
	quarter_end_date: string;
	value: number;
	// rank_value: number;
};

export type Quarters = {
	minQuarter: string;
	maxQuarter: string;
	quarters: string;
};
