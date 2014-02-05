define([
	'app',

	'select2-lang'

], function(app, select2){



	/******************************************
	* Advanced SelectBox View
	*/
	var AdvancedSelectBoxView = Backbone.View.extend({

		tagName      : 'div',
	
		className    : 'form-group',
		
		templateHTML : 'templates/others/dynamicAdvancedSelectBox.html',

		select2      : null,

		searchParams : [],

		fields       : ['id', 'name'],

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
			this.options = options;


			// Check the Advance SelectBox need template //
			if(!this.options.template){
				this.select2 = $(this.el);	
			}

			this.render();
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
						lang   : app.lang,
						field  : self.options.field
					});

					$(self.el).html(template);

					self.select2 = $(self.el).find('input');

					// Create the advance Select Box
					self.createAdvanceSelectBox();
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
					selectedJSON = this.select2.data('selected-value');

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

					// If no term was enter, results are Alphabetic //
					if(_.isEmpty(query.term)){
						var sortResults = _.sortBy(results, function(result){ 
							return result.text;
						})
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
						})

						var sortResults = _.union(beginWithResults, otherResults);
					}

					return sortResults;
				},
				containerCssClass: function(){
					if(!_.isUndefined(self.select2.data('tag-large'))){ 
						return 'tag-large';
					}
				}
			};


			if(!_.isUndefined(self.options.url)){
				select2Options.query = function(query){

					// SEARCH PARAMS //
					var params = [];
					
					params.push({ field: 'name', operator: 'ilike', value: query.term });

					// Set all the search params in the params for the query //
					if(!_.isEmpty(self.searchParams)){
						_.each(self.searchParams, function(query, index){
							params.push(query);
						})
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

						_.each(data, function(item, index){
							returnData.results.push({
								id   : item.id,
								text : _.titleize(item.name.toLowerCase())
							});
						});

						// Return the query //
						query.callback(returnData);
					});

				};
			}
			else{
				select2Options.data = this.options.data
			}

			this.select2.select2(select2Options);

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
				var itemData = {id: item.id, text: item.name};
				data.push(itemData);
			})

			this.select2.select2('data', data);
		},



		/** Get the value of the selected item
		*/
		getSelectedItem: function(){

			if(!_.isNull(this.select2.select2('data'))){
				var returnId = this.select2.select2('data').id;
			}
			else{
				var returnId = '';
			}
			return returnId;
		},
		
		

		/** Get the value of the selected item
		*/
		getSelectedText: function(){

			if(!_.isNull(this.select2.select2('data'))){
				var name = this.select2.select2('data').text;
			}
			else{
				var name = '';
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
				})
			}

			return returnIds;
		},


		/** Alias for getSelectedItems()
		*/
		getValue: function(){
			var vals = this.getSelectedItems();

			if(!_.isEmpty(vals)){
				return vals;
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

			console.log("Select operator from Dynmaci");

			// Set selected liste active //
			$(this.el).find('.dropdown-menu li').removeClass('active');
			link.addClass('active');


			// Set the operator //
			$(this.el).find('.dropdown-toggle').html(link.data('operator'));

		}

	});

	return AdvancedSelectBoxView;

});