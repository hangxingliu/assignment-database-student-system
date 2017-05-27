type TemplateName =
	"reader/table" |
	"reader/dialog_edit" |

	"lend/table" |
	"lend/dialog_lend" |
	"lend/could_not_lend" |
	"lend/you_can_lend" |
	'lend/lend_failed' |
	"lend/please_input_info" |
	"lend/dialog_back_result" | 

	"book/table" |
	"book/details" |
	"book/dialog_add_book" |
	"book/dialog_edit_info";

type TemplateFunctionsMap = {
	[templateName: string]: Function;
};

type Router = {
	activate(name: string): void;
	deactivate(): void;
	command(command: string): void;
};
type RouterMap = {
	[routerName: string]: Router;
}

type APIMap = {
	base: string;
	[apiName: string]: APIItem;	
};
type APIItem = {
	uri: string;
	
	get?: any;
	post?: any;
};

declare var ejs: {
	compile: Function;
};
declare var app: {
	[x: string]: any
};
declare var global: { app };