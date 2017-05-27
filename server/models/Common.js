//@ts-check
/// <reference path="../type/index.d.ts" />
/// <reference path="../type/tedious.d.ts" />

let { Request, TYPES } = require('tedious');
let { exeRequest } = require('../Database');

let { load: loadSQL } = require('../SqlLoader');

/**
 * @param {any} logger
 * @param {string} sqlName 
 * @param {Function} resolve 
 * @param {Function} reject
 * @param {string} [errDescription]
 */
function generateRequest(logger, sqlName, resolve, reject, errDescription) {
	let req = new Request(loadSQL(sqlName), (err, length, rows) => {
		if (err) {
			logger.e(errDescription || `execute "${sqlName}" failed!`);
			return reject(err);
		}
		return resolve(rows);
	});
	return req;
}

/**
 * @param {any} request 
 * @param {number} page 
 * @param {number} len 
 */
function addPageableParams2Request(request, page, len) {
	let from = (page - 1) * len;
	request.addParameter('offset', TYPES.Int, from);
	request.addParameter('size', TYPES.Int, len);
	return request;
}

const PARAMETERS_MAP = {
	Born: TYPES.Date,
	Name: TYPES.NChar,
	Sex: TYPES.Bit,
	Spec: TYPES.NChar,
	Card: TYPES.NChar,

	ReaderID: TYPES.Int,
	BookID: TYPES.Int,
	BookInfoID: TYPES.Int,
	LendID: TYPES.Int,

	SerialCode: TYPES.Char,

	ISBN: TYPES.NChar,
	BookName: TYPES.NChar,
	Author: TYPES.NChar,
	Publisher: TYPES.NChar,
	Price: TYPES.Float,
	Summary: TYPES.NVarChar,
};
const PARAMTERS_ARRAY = Object.keys(PARAMETERS_MAP);

/**
 * @param {any} logger 
 * @param {string} sqlName 
 * @param {SQLQueryParams} params 
 */
function sql(logger, sqlName, params) {
	return new Promise((resolve, reject) => {
		let req = generateRequest(logger, sqlName, resolve, reject);
		if ('page' in params) addPageableParams2Request(req, params.page, params.len);

		PARAMTERS_ARRAY.forEach(name =>
			name in params && req.addParameter(name, PARAMETERS_MAP[name], params[name]));
		
		exeRequest(req);
	});
}

module.exports = {
	generateRequest,
	addPageableParams2Request,
	sql
};