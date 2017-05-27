//@ts-check
/// <reference path="index.d.ts" />

/**
 * @type {APIMap}
 */
let apiMap = {
	base: '/api/',
	reader_list: { uri: 'reader/list' },
	reader_details: { uri: 'reader/details' },
	reader_add: { uri: 'reader/add', post: true },
	reader_modify: { uri: 'reader/modify', post: true },

	book_list: { uri: 'book/list' },
	book_details: {uri: 'book/details'},
	book_by_serial_code: { uri: 'book/bySerialCode' },

	book_info_add: {uri: 'book/addInfo', post: true},
	book_info_modify: { uri: 'book/modifyInfo', post: true },
	
	book_add: { uri: 'book/add' },
	book_upload_cover: { uri: 'book/uploadCover', post: true },

	lend_book: { uri: 'lend/book' },
	lend_back: { uri: 'lend/back' },
	
	lend_record_list: { uri: 'lend/list' },
};

let convertor = [
	//性别
	data => 'Sex' in data && (data.SexChinese = data.Sex ? '女' : '男'),
	data => Object.keys(data)
		.filter(key => typeof data[key] == 'string')
		.map(key => data[key] = data[key].trim())
];


//======Configurations=====================
//===========================Functions=====
/**
 * @param {string} apiName 
 * @param {any} [data] 
 * @return {Promise}
 */
function request(apiName, data) {
	return new Promise((resolve, reject) => {
		if (!(apiName in apiMap)) return reject(`API ${apiName} is not existed!`);
		let api = apiMap[apiName], method = getMethod(api), isPost = method == 'POST';
		$.ajax({
			url: apiMap.base + api.uri,
			method,
			data: isPost ? JSON.stringify(data) : data,
			dataType: 'json',
			contentType: isPost
				? 'application/json'
				: 'application/x-www-form-urlencoded',
			success: data => {
				// console.log(data);
				if (isErrorResponse(data)) return resolve(optimzeErrorResponse(data));
				data = Array.isArray(data) ? data.map(convert) : convert(data);
				resolve(data);
			},
			error: (xhr, status, desc) => reject(desc)
		})
	});	
}

function isErrorResponse(data) { return data.message && data.code; }
function optimzeErrorResponse(data) {
	if (typeof data.message != 'string') return {error: '网络异常/未知错误!'};
	let match = data.message.match(/\@(\w+)\b/);
	if (match) return { error: `请输入正确的 "${match[1]}" 字段!` };
	match = data.message.toLowerCase().indexOf('unique') >= 0;
	if (match) return { error: '与现有记录重复!' };
	return { error: data.message };
}

/**
 * @param {APIItem} api 
 */
function getMethod(api) {
	if (api.post) return 'POST';
	return 'GET';
}

/**
 * @param {any} data 
 */
function convert(data) {
	for (let func of convertor) func(data);
	return data;
}

module.exports = {
	request, apiMap
};
