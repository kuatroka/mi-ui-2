import DuckDB from 'duckdb';
import { DUCKDB_FULL_PATH } from '$env/static/private';
import type { Cik, Cusip } from './types';

// Instantiate DuckDB
const db = new DuckDB.Database(DUCKDB_FULL_PATH);
const conn = db.connect();

export async function getCik(limit = 60): Promise<Cik[]> {
	const query = (query: string) => {
		return new Promise<Cik[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};
	const sql = `select distinct(cik) as cik, 
                any_value(quarter) as quarter
                from 
                every_cik_qtr_twrr
                GROUP BY all
                LIMIT ${limit}`; // Use template literals correctly
	const entries: Cik[] = await query(sql);
	return entries as Cik[]; // Return an object with entries property
}

export async function getCusip(limit = 60): Promise<Cusip[]> {
	const query = (query: string) => {
		return new Promise<Cusip[]>((resolve, reject) => {
			conn.all(query, (err, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	};
	const sql = `SELECT         
                DISTINCT(cusip) AS cusip,
                ANY_VALUE(name_of_issuer) AS name_of_issuer,
                ANY_VALUE(cusip_ticker) AS cusip_ticker,
                ANY_VALUE(quarter) AS quarter,
                last(value) AS value,
            FROM main
            WHERE cusip_ticker != 'null'
            GROUP BY cusip
            LIMIT ${limit}`; // Use template literals correctly
	const entries: Cusip[] = await query(sql);
	return entries as Cusip[]; // Return an object with entries property
}
