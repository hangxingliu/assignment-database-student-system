/**
 * @param {string} [loggerName] 
 */
function createLog(loggerName) {
	loggerName = loggerName ? `(${loggerName})` : '';
	return {
		i: (...params) => console.log.call(console, '  info:'.blue, loggerName, ...params),
		d: (...params) => console.log.call(console, '  debug:'.green, loggerName, ...params),
		e: (...params) => console.error.call(console, '  error:'.red, loggerName, ...params),
		w: (...params) => console.warn.call(console, '  warn:'.yellow, loggerName, ...params),
	}
}
let defaultLogger = createLog();
module.exports = {
	createLog,
	i: defaultLogger.i,
	d: defaultLogger.d,
	e: defaultLogger.e,
	w: defaultLogger.w
};