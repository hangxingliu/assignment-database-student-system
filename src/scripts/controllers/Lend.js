//@ts-check
/// <reference path="../index.d.ts" />

(function Lend() {
	/**
	 * @type {Router}
	 */
	let router = { activate, deactivate, command};
	module.exports = router;

	let { request } = require('../api'),
		{ encode } = require('../form'),
		{ render, emptyData } = require('../templates');
	
	const ALERT_AREA = '.alert-container',
		DISABLED = 'disabled',	
		BTN_LEND = '#btnLendBook';
		
	let $block = $('#blockLend'),	
		$tbLendRecords = $('#tbLendRecords'),
		$dialog = $('#dlgMain');

	let okLendBookID = false,
		okLendSerialCode = false;

	function activate() {
		$block.slideDown();
		listLendRecords();
	}
	function deactivate() {
		$block.hide();
	}

	function command(cmd) {
		let [what, id] = cmd.split('_');
		console.log('Lend#command', cmd);
		if (what == 'dialog') return showLendDialog(id);
		if (what == 'lend') return confirmLend();
		if (what == 'back') return lendBack(id);
		if (what == 'askCouldLend') return showInfoInDialog();
	}

	function showLendDialog(SerialCode) {
		render('lend/dialog_lend', SerialCode ? { data: {SerialCode}} : emptyData).to($dialog);
		$dialog.modal();
		showInfoInDialog();
	}

	//判断/显示 此书可否被借阅
	async function showInfoInDialog() {
		let data = encode($dialog);
		if (!data || !data.SerialCode) return tipInputMoreInfo();
		let response = await request('book_by_serial_code', data);
		response = response && response[0];
		if (!response || response.LendTime) return tipCouldNotLend(response);
		// console.log(response);
		return tipOKToLend(response);
	}

	function tipInputMoreInfo() { setLendableInfo(false, false); renderAlert('lend/please_input_info', {}); }
	function tipCouldNotLend(data) { setLendableInfo(false, false); renderAlert('lend/could_not_lend', data); }
	function tipOKToLend(data) { setLendableInfo(data.BookID, data.SerialCode); renderAlert('lend/you_can_lend', data); }

	function setLendableInfo(BookID, SerialCode) {
		okLendBookID = BookID;
		okLendSerialCode = SerialCode;
		if(BookID) $(BTN_LEND).removeAttr(DISABLED);
		else $(BTN_LEND).attr(DISABLED, DISABLED);
	}
	/**
	 * @param {TemplateName} tmpl 
	 */
	function renderAlert(tmpl, data) { render(tmpl, { data }).to($dialog.find(ALERT_AREA)); }

	async function confirmLend() {
		//没有可借的书
		let data = $.extend(true, encode($dialog), { BookID: okLendBookID });
		
		if (!okLendBookID ||
			!okLendSerialCode || 
			data.SerialCode != okLendSerialCode) return false;
		
		let response = await request('lend_book', data);
		console.log(response);

		if (response.error) return renderAlert('lend/lend_failed', emptyData);
		//OK
		$dialog.modal('hide');
		app.router.to('lend');
	}

	async function lendBack(LendID) {
		let data = await request('lend_back', { LendID });
		listLendRecords();

		render('lend/dialog_back_result', {data}).to($dialog);
		return $dialog.modal();
	}

	async function listLendRecords() {
		let data = await request('lend_record_list');
		render('lend/table', { data }).to($tbLendRecords);
		console.log(data);
	}
})();