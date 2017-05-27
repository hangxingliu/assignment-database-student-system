//@ts-check
/// <reference path="type/index.d.ts" />

const EMPTY_DATA = {};

function toDate(str) {
	let ps = str.split(/[\s\/\-\:]+/), ts = [];
	for (let i = 0; i < 7; i++) ts[i] = parseInt(ps[i]) || 0;
	ts[1] > 0 && ts[1];
	//@ts-ignore
	return new Date(...ts);
} 

function removeEmptyIDs(data) {
	if (!data.ReaderID) delete data.ReaderID;
	if (!data.BookID) delete data.BookID;
	if (!data.BookInfoID) delete data.BookInfoID;
	if (!data.LendID) delete data.LendID;
}

/**
 * @param {SQLQueryParams_Reader} data 
 */
function Reader(data) {
	if (!data) return EMPTY_DATA;
	removeEmptyIDs(data);
	//防止空白的名字和卡号
	if (!data.Name) delete data.Name;
	if (!data.Card) delete data.Card;
	data.Born = toDate(data.Born);
	//@ts-ignore
	data.Sex = data.Sex == 'true';
	return data;
}

/**
 * @param {SQLQueryParams_Book} data 
 */
function Book(data) {
	if (!data) return EMPTY_DATA;
	removeEmptyIDs(data);
	//防止空白的名字和卡号
	if (!data.ISBN) delete data.ISBN;
	if (!data.BookName) delete data.BookName;
	if (!data.SerialCode) delete data.SerialCode;
	if (!data.Author) delete data.Author;
	if (!data.Publisher) delete data.Publisher;
	return data;
}

module.exports = {
	Reader, Book
};