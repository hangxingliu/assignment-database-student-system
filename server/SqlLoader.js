//@ts-check
/// <reference path="type/index.d.ts" />

let { readdirSync, readFileSync } = require('fs'),
	log = require('./Logger').createLog('SqlLoader');

const DEBUG = true;
const SQLPath = `${__dirname}/sqls`;
/**
 * @type {SQLStringMap}
 */
let SQLMap = {};
let inited = false;

function init() {
	inited = true;
	let files = readdirSync(SQLPath)
		.filter(name => name.endsWith('.sql'));
	log.i(`after scan directory: ${files.length} SQL files!`);
	files.forEach(fileName => SQLMap[fileName] = readFileSync(`${SQLPath}/${fileName}`, 'utf8'));
	log.i('finished!');
}

/**
 * @param {string} name 
 */
function load(name) {
	inited || init();
	name = `${name}.sql`;
	if (DEBUG)
		return readFileSync(`${SQLPath}/${name}`, 'utf8');	
	if (!(name in SQLMap))
		log.w(`${name} not in the SQL map`);
	return SQLMap[name] || '';
}

module.exports = {
	load, init
};