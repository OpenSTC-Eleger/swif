define([
	'app',

	'select2-lang'

], function(app){


	'use strict';


	/******************************************
	* Advanced SelectBox View
	*/
	var AdvancedSelectBoxView = Backbone.View.extend({

		tagName      : 'div',
	
		className    : 'form-group',
		
		templateHTML : 'templates/form-components/select.html',

		select2      : null,

		searchParams : [],

		fields       : ['id', 'name'],

		operators    : {
			egal    : { key: 'in',     symbol: '=' },
			notEgal : { key: 'not in', symbol: '&ne;' }
		},

		options      : {
			template          : false,
			placeholder       : '',
			minimumInputLength: 0,
			multiple          : false
		},


		events: {
			'click .dropdown-menu li'  : 'selectOperator'
		},


		/** View Initialization
		*/
		initialize: function(options){
			var self = this;

			this.options = options;
			this.field = options.field;

			// Check the Advance SelectBox need template //
			if(!this.options.template){
				this.select2 = $(this.el);	
			}


			// Set the translation //
			this.operators.egal.label = app.lang.equalTo;
			this.operators.notEgal.label = app.lang.differentFrom;


			// Check if field has operator //
			if(!_.isUndefined(this.field)){
				if(_.isUndefined(this.field.value)){
					this.currentOperator = this.operators.egal;
				}
				else{
					var op = _.filter(this.operators, function(o){
						return o.key == self.field.operator;
					});
					this.currentOperator = op[0];
				}
			}
		},



		/** View Render
		*/
		render: function(){
			var self = this;

			// If there need to retrieve the template //
			if(this.options.template){


				// Retrieve the template //
				$.get(this.templateHTML, function(templateData){

					var template = _.template(templateData, {
						field           : self.field,
						operators       : self.operators,
						currentOperator : self.currentOperator
					});

					$(self.el).html(template);

					self.select2 = $(self.el).find('input');

					// Create the advance Select Box
					self.createAdvanceSelectBox();


					// Set current selected value //
					if(!_.isUndefined(self.field.value)){
						self.select2.select2('val', self.field.value);
					}

				});
			}
			else{

				// Retrieve placeholder attribute //
				if(!_.isUndefined(this.select2.data('placeholder'))){ this.options.placeholder = this.select2.data('placeholder'); }

				// Retrieve minimum-input-length attribute //
				if(!_.isUndefined(this.select2.data('minimum-input-length'))){ this.options.minimumInputLength = this.select2.data('minimum-input-length'); }

				// Retrieve multiple attribute //
				if(!_.isUndefined(this.select2.data('multiple'))){ this.options.multiple = this.select2.data('multiple'); }

				// Create the advance Select Box
				this.createAdvanceSelectBox();

				
				// Set data as Selected //
				if(!_.isUndefined(this.select2.data('selected-value'))){
					var selectedJSON = this.select2.data('selected-value');

					// Check if the select is a Multiple //
					if(_.isArray(selectedJSON)){
						this.setSelectedItems(selectedJSON);
					}
					else{
						this.setSelectedItem([selectedJSON.id, selectedJSON.name]);
					}
				}
			}


			return this;
		},



		/** Create the AdvanceSelectBox
		*/
		createAdvanceSelectBox: function(){
			var self = this;

			var select2Options = {
				allowClear         : true,
				placeholder        : this.options.placeholder,
				multiple           : this.options.multiple, 
				minimumInputLength : this.options.minimumInputLength,
				sortResults: function(results, container, query) {

					var sortResults;

					// If no term was enter, results are Alphabetic //
					if(_.isEmpty(query.term)){
						sortResults = _.sortBy(results, function(result){ 
							return result.text;
						});
					}
					// Display results begin with the term enter and after the rest of the result //
					else{
						var otherResults = [];
						var beginWithResults = _.filter(results, function(result){

							if(_(result.text.toUpperCase()).startsWith(query.term.toUpperCase())){
								return result;
							}else{
								otherResults.push(result);
							}
						});

						sortResults = _.union(beginWithResults, otherResults);
					}

					return sortResults;
				},
				containerCssClass: function(){
					if(!_.isUndefined(self.select2.data('tag-large'))){ 
						return 'tag-large';
					}
				}
			};


			// ManyToOne - Add the Query function if a url is pass //
			if(!_.isUndefined(this.options.url)){
				select2Options.query = function(query){

					// SEARCH PARAMS //
					var params = [];
					
					params.push({ field: 'name', operator: 'ilike', value: query.term });

					// Set all the search params in the params for the query //
					if(!_.isEmpty(self.searchParams)){
						_.each(self.searchParams, function(query){
							params.push(query);
						});
					}


					$.ajax({
						url    : self.options.url,
						method : 'GET',
						data   : {
							fields  : this.fields,
							filters : app.objectifyFilters(params)
						}
					}).done(function(data){

						var returnData = {results: []};

						_.each(data, function(item){
							returnData.results.push({
								id   : item.id,
								text : _.titleize(self.getItemText(item).toLowerCase())
							});
						});

						// Return the query //
						query.callback(returnData);
					});

				};

				// Set data as selected if field has value // TOTO
				select2Options.initSelection = function(element, callback){

					var ids = _.words(element.val(), ',');

					$.ajax({
						url    : self.options.url,
						method : 'GET',
						data   : {
							fields  : self.fields,
							filters : [{ field: 'id', operator: 'in', value: ids }]
						}
					}).done(function(data){

						var returnData = [];

						_.each(data, function(item){
							returnData.push({ id: item.id, text: _.titleize(self.getItemText(item).toLowerCase()) });
						});

						callback(returnData);
					});

				};
			}
			// Selection - Add the Query function if a url is pass //
			else{
				select2Options.data = this.options.data;

				// Set data as selected if field has value // TOTO
				select2Options.initSelection = function(element, callback){
					var ids = _.words(element.val(), ',');

					var data = [];

					_.each(ids, function(index) {
						data.push({ id: index, text: _.capitalize(app.lang[index]) });
					});

					callback(data);
				};
			}

			
			// Select2 Initialization //
			this.select2.select2(select2Options);

		},
		
		getItemText: function(item) {
			if( ! _.isUndefined(item.complete_name)  &&
					item.complete_name!=false)  {
				return item.complete_name
			}
			else 
			{
				return item.name;
			}
		},


		/** Set an item as selected
		*/
		setSelectedItem: function(item){
			this.select2.select2('data', {id: item[0], text: item[1]});
		},



		/** Set somes items as selected
		*/
		setSelectedItems: function(items){
			var data = [];

			_.each(items, function(item){
				var itemData = {id: item.id, text: this.getItemText(item)};
				data.push(itemData);
			});

			this.select2.select2('data', data);
		},



		/** Get the value of the selected item
		*/
		getSelectedItem: function(){

			var returnId = '';

			if(!_.isNull(this.select2.select2('data'))){
				returnId = this.select2.select2('data').id;
			}

			return returnId;
		},
		
		

		/** Get the value of the selected item
		*/
		getSelectedText: function(){

			var name = '';

			if(!_.isNull(this.select2.select2('data'))){
				name = this.select2.select2('data').text;
			}

			return name;
		},


		/** Get the values of the selected item
		*/
		getSelectedItems: function(){

			var returnIds = [];

			if(!_.isEmpty(this.select2.select2('data'))){
				
				_.each(this.select2.select2('data'), function(item){
					returnIds.push(item.id);
				});
			}

			return returnIds;
		},


		/** Get the values text of the selected item
		*/
		getSelectedItemsText: function(){

			var returnText = [];

			if(!_.isEmpty(this.select2.select2('data'))){
				
				_.each(this.select2.select2('data'), function(item){
					returnText.push(item.text);
				});
			}

			return returnText;
		},


		/** Alias for getSelectedItems()
		*/
		getValue: function(humanize){
			var vals = this.getSelectedItems();

			if(!_.isEmpty(vals)){
				
				if(_.isUndefined(humanize)){
					return vals;
				}
				else{
					return _.toSentence(this.getSelectedItemsText(), ', ', ' '+app.lang.and+' ');
				}
			}
			else{
				return null;
			}
		},


		/** Reset the selectBox Value
		*/
		reset: function(){
			this.select2.select2('data', null);
		},



		/** Set a search params
		*/
		setSearchParam: function(query, reset){
			if(reset){
				this.resetSearchParams();
			}

			this.searchParams.push(query);
		},



		/** Reset the search Params
		*/
		resetSearchParams: function(){
			this.searchParams = [];
		},



		/** Select the operator
		*/
		selectOperator: function(e){
			e.preventDefault();

			var link = $(e.currentTarget);


			// Set selected liste active //
			$(this.el).find('.dropdown-menu li').removeClass('active');
			link.addClass('active');

			var operator = link.data('operator');


			// Set the operator //
			$(this.el).find('.dropdown-toggle').html(this.operators[operator].symbol);
			
			this.currentOperator = this.operators[operator];
		},


		/** Return the current selected Operator
		*/
		getOperator: function(type){

			var returnVal;

			switch(type){
				case 'key':
					returnVal = this.currentOperator.key;
					break;
				case 'symbol':
					returnVal = this.currentOperator.symbol;
					break;
				default: 
					returnVal = this.currentOperator.label;
			}

			return returnVal;
		}


	});

	return AdvancedSelectBoxView;

});