app.Helpers.Main = {

	many2oneObjectify : function (field) {
		return {id: field[0], name: field[1]}
	},


	/** Highlight an item
	*/
	highlight: function(highlight_element){
		highlight_element.addClass('highlight');
		var deferred = $.Deferred();

		highlight_element.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
			function(e) {
				highlight_element.removeClass('highlight');
				deferred.resolve();
			}
		);

		return deferred;
	}

}