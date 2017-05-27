//@ts-check
/// <reference path="../type/index.d.ts" />
/// <reference path="../type/tedious.d.ts" />

let { exeRequest } = require('../Database'),
	{ generateRequest ,addPageableParams2Request, sql} = require('./Common'),	
	log = require('../Logger').createLog('models/Book');

module.exports = {
	init,
	list,
	addBookInfo,
	modify,
	addBook,
	details,
	findBySerialCode
};

function init() {
	//验证数据库是否有效
	return new Promise((resolve, reject) => {
		let req = generateRequest(log, 'book_list',
			() => log.i('init success!') + resolve(), reject,
			'init failed! (maybe table struct exception)');
		req = addPageableParams2Request(req, 1, 1);
		exeRequest(req);
	});
}

function list(page, len) { return sql(log, 'book_list', { page, len }); }
function details(id) { return sql(log, 'book_details', { BookID: id }); }
function findBySerialCode(SerialCode) { return sql(log, 'book_find_by_serial_code', { SerialCode });}

function addBookInfo(data) { return sql(log, 'book_info_add', data); }
function modify(data) { return sql(log, 'book_info_modify', data);}

function addBook(BookInfoID, SerialCode) { return sql(log, 'book_add', SerialCode ? { BookInfoID, SerialCode } : {}); }
