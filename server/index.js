//@ts-check

require('colors');

let express = require('express'),
	http = require('http'),
	fs = require('fs-extra'),
	path = require('path'),
	multipart = require('multiparty'),
	bodyParser = require('./middlewares/BodyParser'),
	response404And500 = require('./middlewares/404and500'),
	responseConvertor = require('./ResponseConvertor'),
	requestConvertor = require('./RequestConvertor'),
	Log = require('./Logger'),
	log = Log.createLog('core');

let Database = require('./Database');
let Reader = require('./models/Reader'),
	Book = require('./models/Book'),
	Lend = require('./models/Lend');

const PORT = 8000;
const ADDRESS = '127.0.0.1';

let RESTFUL_API_START = "/api/",
	RESTFUL_API_MATCH = /^\/api\/([\w-]+)\/([\w-]+)/,
	EMPTY_ARRAY = ['', ''],
	RESPONSE_OK = { ok: 'ok' };

let apiMap = {
	//=========== Reader
	'GET reader/list': { func: Reader.list, params: ['page', 'len'] },
	'GET reader/details': { func: Reader.details, params: ['id'] },
	'POST reader/add': {
		func: Reader.add,
		params: [[requestConvertor.Reader, 'data']],
		fromBody: true
	},
	'POST reader/modify': {
		func: Reader.modify,
		params: [[requestConvertor.Reader, 'data']],
		fromBody: true
	},

	'GET book/list': { func: Book.list, params: ['page', 'len'] },
	'GET book/bySerialCode': { func: Book.findBySerialCode, params: ['SerialCode'] },
	'GET book/details': { func: Book.details, params: ['id'] },

	'POST book/addInfo': {
		func: Book.addBookInfo,
		params: [[requestConvertor.Book, 'data']],
		fromBody: true
	},
	'POST book/modifyInfo': {
		func: Book.modify,
		params: [[requestConvertor.Book, 'data']],
		fromBody: true
	},
	
	'GET book/add': { func: Book.addBook, params: ['BookInfoID', 'SerialCode'] },

	'GET lend/list': { func: Lend.list, params: ['page', 'len'] },
	'GET lend/book': { func: Lend.lend, params: ['BookID', 'ReaderID'] },
	'GET lend/back': { func: Lend.back, params: ['LendID'] },
	// 'GET students/del': { func: Student.deletes, params: [[convert.split, 'ids']] },
	// 'GET students/focus': { func: Student.setFocus, params: ['id', [convert.boolean, 'focus']] },
	// 'POST students/edit': { func: Student.modify, params: ['data'], fromBody: true },
	// 'GET class/list': {func: Student.listClasses, params: []},
	// 'GET talks/del_img': { func: removeUploadImage, params: ['img'] },
	// 'POST talks/upload_img': { func: uploadImage }
};
(function compilerApiMap() {
	Object.keys(apiMap)	
		.map(name => apiMap[name])
		.forEach(context => context.invoke = generateApiInvoke(context))
})();

main();

//================Functions==================

function generateApiInvoke(apiContext) {
	let noSpecialParams = !apiContext.params;
	if (noSpecialParams) apiContext.params = []; 
	let { fromBody, params, func } = apiContext;
	return (req, res) => {
		let paramFrom = fromBody ? req.body : req.query,
			ps = noSpecialParams ? [req, res] : [];
		for (let p of params)
			ps.push(Array.isArray(p)
				? p[0].apply(null, p.slice(1).map(name => paramFrom[name]))
				: paramFrom[p] );
		let result = func.apply(null, ps);
		if (result) {
			if (typeof result == 'object') {
				if (result instanceof Promise)
					return result.then(data =>
						res.json(responseConvertor.convert(
							unpackSQLServerResult(data) || RESPONSE_OK)))
						.catch(err => res.json(responseError(err) ));
				return res.json(result);
			}
		} 
		return res.end();
	}
}
function unpackSQLServerResult(result) {
	if (!Array.isArray(result)) return result;
	let newResult = [], newRow = {};
	for (let row of result) {
		if (!Array.isArray(row)) return result;
		for (let col of row)
			col && col.metadata &&
				col.metadata.colName && (newRow[col.metadata.colName] = col.value);
		newResult.push(newRow);
		newRow = {};
	}
	return newResult;
}

function responseError(err) { return typeof err == 'object' ? err : { err } }

function main() {
	let web = express();
	let server = http.createServer(web);
	//记录日志
	web.use(require('morgan')('dev'));
	//HTTP参数解析
	bodyParser.bind(web);
	//静态资源
	web.use('/', express.static(`${__dirname}/../dist`));
	//规范化请求参数(翻页...)
	web.use(require('./middlewares/queryParameters'));
	//RESTFUL API
	web.use((req, res, next) => {
		if (!req.url.startsWith(RESTFUL_API_START)) return next();
		let [_, controller, action] = req.url.match(RESTFUL_API_MATCH) || EMPTY_ARRAY,
			apiFullName = `${req.method} ${controller}/${action}`;
		log.d('api request', apiFullName.bold);
		let api = apiMap[apiFullName];
		api ? api.invoke(req, res) : next();
	});
	//404 && 500
	response404And500.bind(web);

	//开始初始化
	process.on('SIGINT', serverExit);

	let log = Log.createLog('init');
	Database.init()
		.then(() => serverListen(server))
		.then(() => Reader.init())
		.then(() => Book.init())
		.then(() => Lend.init())
		.then(() => log.i('finished!'))
		.catch(ex => log.e(ex.stack || ex));
	
	function serverExit() {	
		let log = Log.createLog('exit');
		log.i('closing database!');
		Database.close(() => process.exit(0));
		// log.i('closing server!');
		// server.close();
	}
}

function serverListen(server) {
	return new Promise((resolve, reject) => {
		let log = Log.createLog('server');
		server.listen(PORT, ADDRESS);
		server.on('error', error => {
			if (error.syscall !== 'listen')
				return log.e(error);
			let prefix = `server could not listen on ${ADDRESS}:${PORT}. `;
			switch (error.code) {
				case 'EACCES':
					return reject(`${prefix} because it requires elevated privileges`);
				case 'EADDRINUSE':
					return reject(`${prefix}  because it is already in use`);
				default:
					return reject(error);
			}
		});		
		server.on('close', () => log.i('closed!'));
		server.on('listening', resolve);
	});
}