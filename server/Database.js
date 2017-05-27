//@ts-check
/// <reference path="type/tedious.d.ts" />

let { Connection } = require('tedious'),
	log = require('./Logger').createLog('database');
let config = require('./db.config');

let closedCallback = null;

/**
 * @type {TediousConnection}
 */
let connection = null;

/**
 * @returns {Promise<any>}
 */
function init() {
	//@ts-ignore
	connection = new Connection(config);
	connection.on('error', err => log.e('exception', err.stack || err));
	connection.on('end', err => err ? log.e('close failed!', err.stack || err)
		: (log.i('closed!'), closedCallback && closedCallback()) );

	return new Promise((resolve, reject) => {
		connection.on('connect', err => {
			if (err) {
				log.e('connect failed!');
				return reject(err.stack || err)
			}
			log.i('connected!');
			resolve();
		});
	});	
}

function close(_callback) {
	_callback && (closedCallback = _callback);
	connection && connection.close();
}

/**
 * @param {any} request 
 */
function exeRequest(request) {
	if (!connection) return false;
	return connection.execSql(request), true;
}

module.exports = {
	init,
	exeRequest,
	close
};
      