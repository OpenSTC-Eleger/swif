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
	},



	/** Calcul the page and the offset
	*/
	calculPageOffset: function(page, itemsPerPage){

		var paginate = {};

		if(_.isUndefined(page)){
			paginate.page = 1;
			paginate.offset = 0;
		}
		else{
			paginate.page = parseInt(page, 10);
			paginate.offset = (paginate.page - 1) * (!_.isUndefined(itemsPerPage) ? itemsPerPage : app.config.itemsPerPage);
		}

		return paginate;
	},



	/** Calcul the sort By column and the order
	*/
	calculPageSort: function(sort){

		var sorter = {};

		sorter.by = _(sort).strLeft('-');
		sorter.order = _(sort).strRight('-');

		return sorter;
	},



	/** Calcul the Filter By
	*/
	calculPageFilter: function(filter){

		var filt = {};

		filt.by = _(filter).strLeft('-');
		filt.value = _(filter).strRight('-');

		return filt;
	},



	/** Calcul the search argument of the page
	*/
	calculSearch: function (searchQuery, searchableFields) {

		//['|', ["name", "ilike", searchQuery], ["surface", "=", _(searchQuery).toNumber()]];
		//['&', ["state", "ilike", 'valid'], '|', ["name", "ilike", 'demande'], ["id", "=", _('demande').toNumber()]];

		var search = [];

		// Is Number //
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		};

		
		// Convert Field Filters //
		function convertFieldFilters(fieldsFilters) {
			var convertedFilters = [];

			function convertFilter(filter, operator) {
				return {key:filter.key, type: operator};
			};

			_.each(fieldsFilters, function (filter, index) {
				switch (filter.type) {
					case 'numeric':
						if (isNumber(searchQuery.search)) {
							convertedFilters.push(convertFilter(filter, '='));
						}
						break;
					case 'text':
						convertedFilters.push(convertFilter(filter, 'ilike'));
						break;
				}
			});
			return convertedFilters;
		};

		var filteredAndConvertedFilters = convertFieldFilters(searchableFields);

		function buildFilterObject(field,operator,value) {
			return {field: field, operator:operator, value:value}
		};

		// Check if there is a filter //
		if (!_.isUndefined(searchQuery.filter)) {
			if (!_.isUndefined(searchQuery.search)) {
				search.push('&');
			}
			search.push( buildFilterObject(searchQuery.filter.by,'ilike',searchQuery.filter.value));
		}

		// Check if there is a Search //
		if (!_.isUndefined(searchQuery.search)) {
			// Search on several fields //
			for(var i=1;i < _.size(filteredAndConvertedFilters);i++){
				search.push('|');
			}

			if (_.size(filteredAndConvertedFilters) > 1) {
				_.each(filteredAndConvertedFilters, function (item, index) {
					if (item.type == '=' && isNumber(searchQuery.search)) {
						var term = _(searchQuery.search).toNumber();
					} else {
						var term = searchQuery.search;
	
					}
					search.push(buildFilterObject(item.key,item.type,term));
				});
			}
			else {
				search.push( buildFilterObject(filteredAndConvertedFilters[0].key,filteredAndConvertedFilters[0].type,searchQuery.search));
			}
		}
		return app.objectifyFilters(search);
	},
	


	printError: function (e) {
		$('.form-group').removeClass('has-error');
		$('.help-block').html('');
		$('#'+fieldId).html(app.lang.errorMessages[message]);
		var fieldId = _(_(e.responseJSON.faultCode).strRight('*')).strLeft('*') + "-error";
		var message =  _.trim( _(e.responseJSON.faultCode).strRight("/") ); 
		$('#'+fieldId).html(app.lang.errorMessages[message]);
		$('#'+fieldId).parents('.form-group').addClass('has-error');
	},



	// Clear all the view off the app Undelegate and delete //
	clearViews: function(){


			_.each(app.views, function(view, viewName){
				view.undelegateEvents();
			});

	}
					
}