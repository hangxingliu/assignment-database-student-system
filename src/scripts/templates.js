//@ts-check
/// <reference path="index.d.ts" />

/**
 * @type {TemplateFunctionsMap}
 */
let templates = {};
let hadInit = false;

function loadTemplates() {
	for (let name in templates)
		delete templates[name];	
	
	let $tmpl = $('script[type="text/template"]');
	for(var i = 0 ; i < $tmpl.length ; i++ ) {
		let $t = $tmpl.eq(i);
		// console.log($t.data('tmpl'));
		templates[$t.data('tmpl')] = ejs.compile($t.html());
	}
	hadInit = true;
}

/**
 * @param {TemplateName} name 
 * @param {any} data 
 * @returns  {string}
 */
function renderToString(name, data) {
	if (!hadInit) loadTemplates();
	return name in templates ? templates[name](data || {}) : "";
}

/**
 * @param {TemplateName} name 
 * @param {any} data 
 */
function render(name, data) {
	if (!hadInit) loadTemplates();
	let html = "";
	if (name in templates)
		html = templates[name](data || {});
	else
		console.warn(`template ${name} is not existed!`);
	return { to: $dom => $dom.html(html) };
}

module.exports = {
	init: loadTemplates,
	renderToString,
	render,
	emptyData: { data: {}}
};
