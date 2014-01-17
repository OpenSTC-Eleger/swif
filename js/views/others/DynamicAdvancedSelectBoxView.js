define([
	'app',

	'select2-lang'

], function(app, select2){



	/******************************************
	* Advanced SelectBox View
	*/
	var DynamicAdvancedSelectBoxView = Backbone.View.extend({
		
		templateHTML : 'others/dynamicAdvancedSelectBox.html',
		
		select2      : null,

		searchParams : [],


		/** View Initialization
		*/
		initialize: function(options){
			//this.select2 = $(this.el);
			this.field = options.field;			
			this.collection = options.collection;
		},



		/** View Render
		*/
		render: function(){
			var self = this;


			
			// Retrieve the template //
			$.get("templates/" + this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang             : app.lang,
					name			 : self.field.key, 

				});

				$(self.el).html(template);

				self.select2 = $("#"+self.field.key);
				
				// Retrieve placeholder attribute //
				if(!_.isUndefined(self.select2.data('placeholder'))){ var placeholder = self.select2.data('placeholder'); }
				else{ var placeholder = ''; }
	
				// Retrieve minimum-input-length attribute //
				if(!_.isUndefined(self.select2.data('minimum-input-length'))){ var minimumInputLength = self.select2.data('minimum-input-length'); }
				else{ var minimumInputLength = 0; }
	
				// Retrieve multiple attribute //
				if(!_.isUndefined(self.select2.data('multiple'))){ var multiple = self.select2.data('multiple'); }
				else{ var multiple = false; }
	
	
				// Check if the collection have a complete Name //
				if(_.contains(self.collection.fields, 'complete_name')){
					var fields = ['id', 'complete_name'];
				}
				else{
					var fields = ['id', 'name'];
				}
			

				self.select2.select2({
					allowClear         : true,
					placeholder        : placeholder,
					multiple           : multiple, 
					minimumInputLength : minimumInputLength,
					//width              : 'resolve',
					query: function(query){
	
						// SEARCH PARAMS //
						var params = [];
						
						if(_.contains(fields, 'complete_name')){
							params.push({ field : 'complete_name', operator : 'ilike', value : query.term});
						}
						else{
							params.push({ field : 'name', operator : 'ilike', value : query.term});	
						}
	
						// Set all the search params in the params for the query //
						if(!_.isEmpty(self.searchParams)){
							_.each(self.searchParams, function(query, index){
								params.push(query);
							})
						}
						// / SEARCH PARAMS //
	
	
						$.ajax({
							url: self.collection.url,
							method: 'GET',
							data: {
								fields  : fields,
								filters : app.objectifyFilters(params)
							}
						}).done(function(data){
	
								var returnData = {results: []};
	
								_.each(data, function(item, index){
									returnData.results.push({
										id   : item.id,
										text : (_.isUndefined(item.complete_name) ? _.titleize(item.name.toLowerCase()) : _.titleize(item.complete_name.toLowerCase()))
									});
								});
	
								// Return the query //
								query.callback(returnData)
							});
	
					},
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
	
				});


				// Set data as Selected //
				if(!_.isUndefined(self.select2.data('selected-value'))){
					selectedJSON = self.select2.data('selected-value');
	
					// Check if the select is a Multiple //
					if(_.isArray(selectedJSON)){
						self.setSelectedItems(selectedJSON);
					}
					else{
						self.setSelectedItem([selectedJSON.id, selectedJSON.name]);
					}
				}
			});
			
			$(this.el).hide().fadeIn();

			return this;

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
		}

	});

return DynamicAdvancedSelectBoxView;

});