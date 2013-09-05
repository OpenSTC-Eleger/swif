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
	
	/** Build the url with the parameters
		*/
	urlBuilder: function(urlParameters, options){
		var self = this;

		// Retrieve the baseurl of the view //
		var url = _(Backbone.history.fragment).strLeft('/');


		// Iterate all urlParameters //
		_.each(urlParameters, function(value, index){

			
			// Check if the options parameter aren't undefined or null //
			if(!_.isUndefined(options[value]) && !_.isNull(options[value])){


				// Check if the value of the parameter is not an object //
				if(!_.isObject(options[value])){

					url += '/'+value+'/'+options[value];
				}
				else{

					// Check if the value is the page //
					if(value == 'page'){
						url += '/'+value+options[value].page;
					}
					else{

						var params = '';
						_.each(options[value], function(value, item){
							if(!_.isEmpty(params)){
								params += '-'+value;
							}
							else{
								params += value;
							}
						})

						url += '/'+value+'/'+params;
					}
				}
			}

		})

		return url;
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