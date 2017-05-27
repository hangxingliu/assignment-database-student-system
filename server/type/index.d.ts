type SQLStringMap = { [sqlName: string]: string };

type SQLQueryParams = SQLQueryParams_ID &
	SQLQueryParams_Pageable &
	SQLQueryParams_Reader & 
	SQLQueryParams_Book;

type SQLQueryParams_ID = { id?: number };
type SQLQueryParams_Pageable = { page?: number, len?: number };
type SQLQueryParams_Reader = {
	Born?: Date;
	Name?: string;
	Sex?: boolean;
	Card?: string;
	Spec?: string;
	ReaderID?: number;
};
type SQLQueryParams_Book = {
	BookID?: number;
	BookInfoID?: number;

	SerialCode?: string;
	
	ISBN?: string;
	BookName?: string;
	Author?: string;
	Publisher?: string;
	Price?: number;
	Summary?: string;
}

type SQLResultRowMaybe = {
	Born?: Date | string;
	LendTime?: Date | string | null;
	BackTime?: Date | string | null;
	Cover?: Buffer;
	Photo?: Buffer;
};