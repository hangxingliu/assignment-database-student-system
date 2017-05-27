(function Menu() {
	const EXPAND_CLASS_NAME = 'expand';
	const ACTIVE_CLASS_NAME = 'active';
	let $menu = $('.left-menu');

	function toggleMenu() {
		$menu.hasClass(EXPAND_CLASS_NAME)
			? $menu.removeClass(EXPAND_CLASS_NAME)
			: $menu.addClass(EXPAND_CLASS_NAME);	
	}
	/**
	 * @param {string} name 
	 */
	function activeItem(name) {
		$menu.find('.list-group-item').each((i, e) => {
			let $e = $(e);
			$e.attr('href') == `#${name}`
				? $e.addClass(ACTIVE_CLASS_NAME)
				: $e.removeClass(ACTIVE_CLASS_NAME);
		})
	}
	
	module.exports = {
		toggle: toggleMenu,
		active: activeItem
	};
})();