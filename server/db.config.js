//@ts-check
/// <reference path="type/tedious.d.ts" />

/**
 * @type {TediousConnectionConfig}
 */
let config = {
	userName: 'sa',
	password: 'MshitSQL233',
	server: '127.0.0.1',
	options: {
		database: 'DBLibrary',
		encrypt: true,
		rowCollectionOnRequestCompletion: true
	}
};

module.exports = config;
