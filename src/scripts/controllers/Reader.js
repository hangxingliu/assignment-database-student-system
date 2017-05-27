//@ts-check
/// <reference path="../index.d.ts" />

(function Reader() {
	/**
	 * @type {Router}
	 */
	let router = { activate, deactivate, command};
	module.exports = router;

	let { request } = require('../api'),
		{ encode } = require('../form'),
		{ render, emptyData } = require('../templates'),
		activeFinished = false;

	const WARNING_AREA = '.alert-danger';

	let $block = $('#blockReader'),	
		$tbReaders = $('#tbReaders'),
		$dialog = $('#dlgMain');

	function activate() {
		activeFinished = false;
		$block.slideDown();
		listReaders();
	}
	function deactivate() {
		$block.hide();
	}

	const COMMAND_MAP = {
		edit: editReader,
		add: () => showModal(),
		save: save
	};
	function command(cmd = '') {
		let [what, id] = cmd.split('_');
		console.log('Reader#command', cmd);
		activeFinished && what in COMMAND_MAP && COMMAND_MAP[what](id);
	}

	async function save() {
		let data = encode($dialog);
		let response = await request(data.ReaderID ? 'reader_modify' : 'reader_add', {data});
		if (response.error) return $dialog.find(WARNING_AREA).text(response.error).show();
		listReaders();
		$dialog.modal('hide');
	}
	
	async function editReader(id) {
		let data = await request('reader_details', { id });
		showModal({ data: data[0] });
		// console.log(data);
	}
	function showModal(data) {
		render('reader/dialog_edit', data || emptyData).to($dialog);
		$dialog.modal();
		$dialog.find(WARNING_AREA).hide();
	}

	async function listReaders() {
		let data = await request('reader_list');
		render('reader/table', { data }).to($tbReaders);
		console.log(data);
		activeFinished = true;
	}
})();