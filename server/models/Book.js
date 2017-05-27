//@ts-check
/// <reference path="../type/index.d.ts" />
/// <reference path="../type/tedious.d.ts" />

const BOOK_COVER_PATH = '.book-covers';
const BOOK_COVER_UPLOAD_TEMP_PATH = `${BOOK_COVER_PATH}/tmp`;

let { exeRequest } = require('../Database'),
	{ generateRequest ,addPageableParams2Request, sql} = require('./Common'),	
	log = require('../Logger').createLog('models/Book'),
	fs = require('fs-extra'),
	multipart = require('multiparty');

module.exports = {
	COVER_PATH: BOOK_COVER_PATH,
	init,
	list,
	addBookInfo,
	modify,
	addBook,
	details,
	findBySerialCode,
	uploadCover
};

function init() {
	//创建必要路径
	fs.mkdirsSync(BOOK_COVER_PATH);
	fs.removeSync(BOOK_COVER_UPLOAD_TEMP_PATH);
	fs.mkdirsSync(BOOK_COVER_UPLOAD_TEMP_PATH);
	log.i('created necessary directories!');
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

function uploadCover(req) {
	return new Promise((resolve, reject) => {
		// TODO 查询这个BookInfoID 是否存在
		// console.log(req.query);
		let { BookInfoID } = req.query;
		BookInfoID = Number(BookInfoID);
		if (!BookInfoID || isNaN(BookInfoID)) return reject('请传递有效的BookInfoID参数');
		let form = new multipart.Form({ uploadDir: BOOK_COVER_UPLOAD_TEMP_PATH });
		form.parse(req, function (err, fields, files) {
			console.log(fields, files);
			if (err) return reject(err);
			if (!files || !files.file || !files.file.length) return reject('请上传封面图片');
			let originalPath = files.file[0].path,
				targetPath = `${BOOK_COVER_PATH}/${BookInfoID}.jpg`;
			fs.move(originalPath, targetPath, err => 
				err ? reject(`移动临时文件到目标文件 ${targetPath} 失败!`) : resolve([]));
		});
	});	
}