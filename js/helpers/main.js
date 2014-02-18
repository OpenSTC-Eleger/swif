define('appHelpers', [

	'app',
	'userModel',

	'filterModel',

	'moment-timezone',
	'moment-timezone-data'

], function(app, UserModel, FilterModel, moment){

	'use strict';


	/******************************************
	* Helpers
	*/
	var AppHelpers = {

		many2oneObjectify : function (field) {
			return {id: field[0], name: field[1]};
		},



		/** Highlight an item
		*/
		highlight: function(highlight_element){

			highlight_element.addClass('highlight');
			var deferred = $.Deferred();

			highlight_element.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
				function() {
					highlight_element.removeClass('highlight');
					deferred.resolve();
				}
			);

			return deferred;
		},



		/** Transform Decimal number to hour:minute
		*/
		decimalNumberToTime: function(decimalNumber){

			var date;

			// Check if the number is decimal //
			if(_.str.include(decimalNumber, '.')){
				var minutes = _.lpad(((_.rpad(_(decimalNumber).strRight('.'), 2, '0') / 100) * 60), 2, '0');
				var hour = _(decimalNumber).strLeft('.');

				if(hour === 0){
					date = _(minutes).toNumber()+app.lang.minuteShort;
				}
				else{
					date = hour+'h'+_(minutes).toNumber();
				}
			}
			else{
				date = decimalNumber+'h';
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

		/** Calcul the search argument of the page
		*/
		calculSearch: function (searchQuery, searchableFields) {

			//['|', ["name", "ilike", searchQuery], ["surface", "=", _(searchQuery).toNumber()]];
			//['&', ["state", "ilike", 'valid'], '|', ["name", "ilike", 'demande'], ["id", "=", _('demande').toNumber()]];

			var search = [];

			// Is Number //
			function isNumber(n) {
				return !isNaN(parseFloat(n)) && isFinite(n);
			}


			// Convert Field Filters //
			function convertFieldFilters(fieldsFilters) {
				var convertedFilters = [];

				function convertFilter(filter, operator) {
					return {key:filter.key, type: operator};
				}

				_.each(fieldsFilters, function (filter) {
					switch (filter.type) {
						case 'numeric':
							if (isNumber(searchQuery.search)) {
								convertedFilters.push(convertFilter(filter, '='));
							}
							break;
						case 'text':
						case 'char':
							convertedFilters.push(convertFilter(filter, 'ilike'));
							break;
					}
				});
				return convertedFilters;
			}

			var filteredAndConvertedFilters = convertFieldFilters(searchableFields);

			function buildFilterObject(field,operator,value) {
				return {field: field, operator:operator, value:value};
			}

			// Check if there is a Search //
			if (!_.isUndefined(searchQuery.search)) {
				// Search on several fields //
				for(var i=1; i < _.size(filteredAndConvertedFilters); i++){
					search.push('|');
				}

				if (_.size(filteredAndConvertedFilters) > 1) {
					_.each(filteredAndConvertedFilters, function (item) {
						var term;

						if (item.type == '=' && isNumber(searchQuery.search)) {
							term = _(searchQuery.search).toNumber();
						} else {
							term = searchQuery.search;
						}
						search.push(buildFilterObject(item.key,item.type,term));
					});
				}
				else {
					search.push( buildFilterObject(filteredAndConvertedFilters[0].key,filteredAndConvertedFilters[0].type,searchQuery.search));
				}
			}

			if (!_.isUndefined(searchQuery.filter) && !_.isNumber(searchQuery.filter)) {
				_.each(searchQuery.filter, function (item) {
					if( item.field == 'state' ) {
						search.push(buildFilterObject(item.field,item.operator,item.value));
					}
					else if( _.isArray(item.value)){
						search.push(buildFilterObject(item.field+'.id',item.operator,item.value));
					}
					else{
						search.push(buildFilterObject(item.field,item.operator,item.value));
					}
				});
			}
			return app.objectifyFilters(search);
		},



		/**
		 * Get filter by field name
		 * @param JSONfilters : filters, ex : [{"field":"user_id","operator":"in","value":[278]}, {"field":"name","operator":"ilike","value":"name"}]
		 * @param field : field name key, ex : "user_id"
		 * @return json value, ex for "user_id"	: {"field":"user_id","operator":"in","value":[278]}
		 */
		getFilterValue: function(filters, field) {
			if(_.isUndefined(filters)){
				return undefined;
			}
			else{

				try {
					filters = JSON.parse(filters);
				}
				catch(e){
					console.error('Filter is an object, not a JSON');
				}

				return _.find(filters, function(f){
					return f.field == field;
				});
			}
		},



		printError: function (e) {
			//Get error field
			var fieldId = _(_(e.responseJSON.faultCode).strRight('*')).strLeft('*') + '-error';
			try{
				_.isUndefined($('#'+fieldId));
			}catch(error){
				fieldId = 'name-error';
			}

			//get error message
			var message = e.responseJSON.faultCode;
			var codeMessage = 'nameUniq';
			if( _.str.include(message,'/') ) {
				codeMessage =  _.trim( _(e.responseJSON.faultCode).strRight('/') );
			}

			//Displays message in form
			$('.form-group').removeClass('has-error');
			$('.help-block').html('');
			$('#'+fieldId).html(app.lang.errorMessages[codeMessage]);
			$('#'+fieldId).html(app.lang.errorMessages[codeMessage]);
			$('#'+fieldId).parents('.form-group').addClass('has-error');
		},



		/** Convert Date to TimeZoneDate
		*/
		convertDateToTz : function(date) {
			var convertedDate = moment(date);

			if( app.current_user.getContext().tz ) {
				convertedDate.tz(app.current_user.getContext().tz);
				convertedDate.add('minutes',-convertedDate.zone());
			}

			return convertedDate;
		},



		/** Transform Hexa color into RGB color
		*/
		hexaToRgb : function(arg){
			if (arg.length === 3) { arg = arg.charAt(0) + arg.charAt(0) + arg.charAt(1) + arg.charAt(1) + arg.charAt(2) + arg.charAt(2); }

			return [parseInt(arg.substr(0,2), 16).toString(), parseInt(arg.substr(2,2), 16).toString(), parseInt(arg.substr(4,2), 16).toString()];
		}

	};

	return AppHelpers;

});