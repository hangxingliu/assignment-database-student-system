/**
 * 可翻页参数
 */
module.exports = function (req, res, next) {
	let q = req.query;

	q.id = Number(q.id) || 0;
	q.page = Number(q.page) || 1;
	q.len = Number(q.len) || 20;
	
	q.word = q.word || '';

	next();
};