//@ts-check
/// <reference path="index.d.ts" />

(function Router() {

	let menu = require('./menu');

	/**
	 * @type {RouterMap}
	 */
	let routerMap = {};
	/**
	 * @type {Router}
	 */
	let currentController = null;

	/**
	 * @param {string} name 
	 * @param {Router} router 
	 */
	function register(name, router) {
		routerMap[name] = router;
	}
	
	/**
	 * @param {string} routerExpression 
	 */
	function to(routerExpression) {
		let [name, command] = routerExpression.split(/[\/\s\:]/);
		if (!(name in routerMap)) return console.warn(`controller ${name} is not existed!`);
		let router = routerMap[name];
		currentController && currentController.deactivate();
		router.activate(name);
		menu.active(name);
		currentController = router;
		command && router.command(command);
	}

	/**
	 * @param {string} command 
	 */
	function command(cmd) {
		let [controller, command] = cmd.split(/[\/\s\:]/);
		if (!command) {
			if (!currentController) return console.warn(`no any controller is activing!`);
			currentController.command(controller);
		} else {
			if (!(controller in routerMap)) return console.warn(`controller ${controller} is not existed!`);
			routerMap[controller].command(command);
		}
	}

	module.exports = {
		register,
		to,
		command
	};
})();