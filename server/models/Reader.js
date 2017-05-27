//@ts-check
/// <reference path="../type/index.d.ts" />
/// <reference path="../type/tedious.d.ts" />

let { exeRequest } = require('../Database'),
	{ generateRequest, addPageableParams2Request, sql} = require('./Common'),
	log = require('../Logger').createLog('models/Reader');

module.exports = {
	init,
	
	list,
	details,
	add,
	modify
};

function init() {
	//验证数据库是否有效
	return new Promise((resolve, reject) => {
		let req = generateRequest(log, 'reader_list',
			() => log.i('init success!') + resolve(), reject,
			'init failed! (maybe table struct exception)');
		req = addPageableParams2Request(req, 1, 1);
		exeRequest(req);
	});
}

function list(page, len) { return sql(log, 'reader_list', { page, len });}
function details(id) { return sql(log, 'reader_details', { ReaderID: id });}

function add(data) { return sql(log, 'reader_add', data); }
function modify(data) { return sql(log, 'reader_modify', data);}