//@ts-check
/// <reference path="type/index.d.ts" />

/**
 * @param {SQLResultRowMaybe} row 
 * @param {number} i 
 */
function convertEachRow(row, i) {
	if (!row) return;
	if (row.Photo) delete row.Photo;
	if (row.Cover) delete row.Cover;
	if (row.Born instanceof Date)
		row.Born = yyyymmdd(row.Born);
	if (row.LendTime instanceof Date)
		row.LendTime = yyyymmddhhmmss(row.LendTime);
	if (row.BackTime && row.BackTime instanceof Date)
		row.BackTime = yyyymmddhhmmss(row.BackTime);
}

//=====================================
/**
* @param {Date} date
*/
function yyyymmdd(date) { return `${date.getFullYear()}-${to2(date.getMonth() + 1)}-${to2(date.getDate())}` }
/**
* @param {Date} date
*/
function hhmmss(date) { return `${to2(date.getHours())}:${to2(date.getMinutes())}:${to2(date.getSeconds())}` }
function yyyymmddhhmmss(date) { return yyyymmdd(date) + ' ' + hhmmss(date); }
//===============
function to2(i) { i = String(i); return i.length < 2 ? `0${i}` : i; }

function convert(data) {
	if (Array.isArray(data))
		data.forEach(convertEachRow);	
	return data;
}

module.exports = {
	convert
};