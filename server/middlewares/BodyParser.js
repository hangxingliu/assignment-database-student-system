//@ts-check
var bodyParser = require('body-parser');
module.exports = {
	bind: (expressServer) => {
		//POST参数解析
		expressServer.use(bodyParser.urlencoded({ extended: false }));
		expressServer.use(bodyParser.json());
	}
};