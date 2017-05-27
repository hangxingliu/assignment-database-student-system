//@ts-check
/// <reference path="../type/index.d.ts" />
/// <reference path="../type/tedious.d.ts" />

let { exeRequest } = require('../Database'),
	{ generateRequest, addPageableParams2Request, sql} = require('./Common'),
	log = require('../Logger').createLog('models/Lend');

module.exports = {
	init,
	
	list,
	lend,
	back
};

function init() {
	//验证数据库是否有效
	return new Promise((resolve, reject) => {
		let req = generateRequest(log, 'lend_list',
			() => log.i('init success!') + resolve(), reject,
			'init failed! (maybe table struct exception)');
		req = addPageableParams2Request(req, 1, 1);
		exeRequest(req);
	});
}

function list(page, len) { return sql(log, 'lend_list', { page, len });}

function lend(BookID, ReaderID) { return sql(log, 'lend_book', {BookID, ReaderID}); }
function back(LendID) { return sql(log, 'lend_back', {LendID});}