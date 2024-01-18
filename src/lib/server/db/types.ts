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
