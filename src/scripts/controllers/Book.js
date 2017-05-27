//@ts-check
/// <reference path="../index.d.ts" />

(function Book() {
	/**
	 * @type {Router}
	 */
	let router = { activate, deactivate, command};
	module.exports = router;

	let { request, apiMap } = require('../api'),
		{ encode } = require('../form'),
		{ render, emptyData } = require('../templates'),
		activeFinished = false,
		currentBookInfo = null;

	const ALERT = '.alert-danger', UPLOADER = '#coverUploader';
	
	let $block = $('#blockBook'),
		$tbBooks = $('#tbBooks'),
		$dialog = $('#dlgMain'),
		$blockBookDetails = $('#blockBookDetails'),
		$containerBtnAdd = $block.find('.add-container'),
		$containerBtnModify = $block.find('.modify-container');

	function activate() {
		activeFinished = false;
		$block.slideDown();
		listBooks();
	}
	function deactivate() {
		$block.hide();
	}
	/**
	 * @param {string} cmd 
	 */
	function command(cmd) {
		let [what, id] = cmd.split('_');
		console.log('Book#command', cmd);
		if (!activeFinished) return;
		switch (what) {
			case 'details': return bookDetails(id);
			case 'addInfo': case 'modify': return bookInfoEdit();
			case 'save': return saveBookInfo();
			case 'add': return showAddBookDialog();
			case 'addConfirmed': return confirmAddBook();
			case 'uploadCover': return uploadBookCover();
		}
	}

	function showAddBookDialog() {
		render('book/dialog_add_book', { data: currentBookInfo }).to($dialog);
		$dialog.find(ALERT).hide();
		$dialog.modal();
	}
	async function confirmAddBook() {
		let data = encode($dialog);
		let response = await  request('book_add', data);
		if (response.error) return $dialog.find(ALERT).text(response.error).show();
		bookDetails(currentBookInfo.BookInfoID);
		$dialog.modal('hide');
	}

	function bookInfoEdit() {
		render('book/dialog_edit_info', currentBookInfo ? { data: currentBookInfo } : emptyData).to($dialog);
		$dialog.find(ALERT).hide();
		$dialog.modal();
	}

	async function saveBookInfo() {
		let data = encode($dialog);
		let response = await request(data.BookInfoID ? 'book_info_modify' : 'book_info_add' , {data});
		if (response.error) return $dialog.find(ALERT).text(response.error).show();
		data.BookInfoID ? bookDetails(data.BookInfoID) : listBooks();
		$dialog.modal('hide');
	}

	async function bookDetails(id) {
		let data = await request('book_details', { id });
		render('book/details', { data }).to($blockBookDetails);
		$containerBtnAdd.hide(); $containerBtnModify.show();
		
		$tbBooks.hide();
		$blockBookDetails.show();

		currentBookInfo = data[0];		
	}

	async function listBooks() {
		$tbBooks.show();
		$blockBookDetails.hide();

		let data = await request('book_list');
		render('book/table', { data }).to($tbBooks);
		$containerBtnAdd.show(); $containerBtnModify.hide();
		activeFinished = true;
		currentBookInfo = null;
	}

	function uploadBookCover() {
		//@ts-ignore
		let files = $(UPLOADER)[0].files;
		if (!files.length) return alert("请先选择图书封面图片!");	
		let xhr = new XMLHttpRequest();
		let form = new FormData();
		form.append("file", files[0]);
		xhr.open("POST", apiMap.base + apiMap.book_upload_cover.uri +
			`?BookInfoID=${currentBookInfo.BookInfoID}`, true);
		xhr.onload = () => {
			try {
				let ret = JSON.parse(xhr.responseText);
				if (ret.error) throw new Error(ret.error);
			} catch (e) {
				return alert("上传出错!\n " + e.message || e);
			}
			let $cover = $('#imgBookCover');
			$cover.attr('src', $cover.data('src') + '?t=' + Date.now());
		};
		xhr.onerror = () => alert(`上传出错\n 服务器异常!`);
		xhr.send(form);	
	}
})();