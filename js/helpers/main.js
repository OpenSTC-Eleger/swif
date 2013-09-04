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
	},



	/** Transform Decimal number to hour:minute
	*/
	decimalNumberToTime: function(decimalNumber){

		// Check if the number is decimal //
		if(_.str.include(decimalNumber, '.')){
			var minutes = _.lpad(((_.rpad(_(decimalNumber).strRight('.'), 2, '0') / 100) * 60), 2, '0');
			var hour = _(decimalNumber).strLeft('.');

			if(hour == 0){
				var date = _(minutes).toNumber()+app.lang.minuteShort;
			}
			else{
				var date = hour+'h'+_(minutes).toNumber();    
			}
		}
		else{
			var date = decimalNumber+'h';
		}
		
		return date;
	}


}