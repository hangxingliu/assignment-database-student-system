//@ts-check
/// <reference path="index.d.ts" />

let App = function () {

	let menu = require('./menu'),
		router = require('./router');
	let controllers = {
		reader: require('./controllers/Reader'),
		book: require('./controllers/Book'),
		lend: require('./controllers/Lend')
	};

	Object.keys(controllers).map(name => router.register(name, controllers[name]));
	
	let defaultController = location.hash ? location.hash.slice(1) : 'null';
	router.to(defaultController.split(/[\/\s\:]/)[0] in controllers ? defaultController : 'reader');
	
	this.router = router;
	this.menu = menu;
};

global.app = new App();