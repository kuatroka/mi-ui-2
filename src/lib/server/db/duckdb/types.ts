export type Track = {
	trackId: number;
	trackName: string;
	albumId: number;
	albumTitle: string;
	artistId: number;
	artistName: string;
	genre: string;
};

export type Album = {
	albumId: number;
	albumTitle: string;
	artistId: number;
	artistName: string;
};

export type AlbumTrack = {
	trackId: number;
	trackName: string;
	trackMs: number;
};

export type Cik = {
	cik: number;
	quarter: string;
};

export type Cusip = {
	cusip: string;
	name_of_issuer: string;
	cusip_ticker: string;
	quarter: string;
	value: number;
};