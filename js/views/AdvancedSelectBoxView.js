/******************************************
* Advanced SelectBox View
*/
app.Views.AdvancedSelectBoxView = Backbone.View.extend({
	

	select2      : null,

	searchParams : [],


	/** View Initialization
	*/
	initialize: function(){
		this.collection_url = this.options.collection_url;
		this.select2 = $(this.el);
	},



	/** View Render
	*/
	render: function(){
		var self = this;

		// Retrieve placeholder attribute //
		if(!_.isUndefined(this.select2.data('placeholder'))){ var placeholder = this.select2.data('placeholder'); }
		else{ var placeholder = ''; }

		// Retrieve minimum-input-length attribute //
		if(!_.isUndefined(this.select2.data('minimum-input-length'))){ var minimumInputLength = this.select2.data('minimum-input-length'); }
		else{ var minimumInputLength = 0; }

		// Retrieve multiple attribute //
		if(!_.isUndefined(this.select2.data('multiple'))){ var multiple = this.select2.data('multiple'); }
		else{ var multiple = false; }


		this.select2.select2({
			allowClear         : true,
			placeholder        : placeholder,
			multiple           : multiple, 
			minimumInputLength : minimumInputLength,
			width              : 'resolve',
			query: function(query){

				var params = [];
				params.push({ field : 'name', operator : 'ilike', value : query.term});
				// Set all the search params in the params for the query //
				if(!_.isEmpty(self.searchParams)){
					_.each(self.searchParams, function(query, index){
						params.push(query);
					})
				}

				$.ajax({
					url: self.collection_url,
					method: 'GET',
					data: {
						fields  : ['id', 'name'],
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
			}

		});


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
			console.log('je reset les params');
		}

		this.searchParams.push(query);
	},



	/** Reset the search Params
	*/
	resetSearchParams: function(){
		this.searchParams = [];
	}

});