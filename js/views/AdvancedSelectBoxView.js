/******************************************
* Advanced SelectBox View
*/
app.Views.AdvancedSelectBoxView = Backbone.View.extend({
	

	select2: null,


	/** View Initialization
	*/
	initialize: function(){

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


		this.select2.select2({
			allowClear  : true,
			placeholder : placeholder,
			minimumInputLength: minimumInputLength,
			query: function(query){

				// [The query, [], comparator, {}, the limit ] //
				var params = [query.term, [], 'ilike', {}, 9999];

				app.callObjectMethodOE(params, self.model, 'name_search', app.models.user.getSessionID(), {
					success: function(data){

						var returnData = {results: []};

						_.each(data.result, function(item, index){
							returnData.results.push({
								id: item[0],
								text: _.titleize(item[1].toLowerCase())
							});
						});

						// Return the query //
						query.callback(returnData)
					}
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

	},



	/** Set an item as selected
	*/
	setSelectedItem: function(item){

		this.select2.select2('data', {id: item[0], text: item[1]});
	},



	/** Get the value of the selected item
	*/
	getSelectedItem: function(){

		return this.select2.select2('data').id;
	},



	/** Reset the selectBox Value
	*/
	reset: function(){

		this.select2.select2('data', null);
	}


});