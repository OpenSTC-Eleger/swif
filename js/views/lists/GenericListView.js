define([
	'app',

], function(app){


	/******************************************
	* Generic List View
	*/
	var GenericListView = Backbone.View.extend({

		el            : '#rowContainer',

		urlParameters : ['id', 'search', 'filter', 'sort', 'page'],

		searchForm    : 'form.form-search input',


		// The DOM events //
		events: {
			'click form.form-search input'                  : 'selectSearchInput',
			'submit form.form-search'                       : 'search',
			'click table.table-sorter th[data-sort-column]' : 'sort'
		},



		/** View Initialization
		*/
		render: function(opts) {


			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();


			// Set the sort icon //
			$('th[data-sort-column]').append('<i class="fa fa-sort fa-lg text-muted pull-right">');

			// Display sort icon if there is a sort //
			if(opts.sort.order == 'ASC'){ var newIcon = "fa-sort-up"; }else{ var newIcon = "fa-sort-down"; }
			$("th[data-sort-column='"+opts.sort.by+"'] > i").removeClass('fa-sort text-muted')
			.addClass('active ' + newIcon);

			// Rewrite the research in the form //
			if(!_.isUndefined(opts.search)){
				$(this.searchForm).val(opts.search);
			}

			// Set the focus to the search form //
			$('form.form-search input').focus();
		},



		/** Select the value in the search input when it is focus
		*/
		selectSearchInput: function(e){
			$(e.target).select();
		},



		/** Perform a search on the sites
		*/
		search: function(e){
			e.preventDefault();

			var query = $(this.searchForm).val();

			// Check if the query is valid //
			if(this.isQueryValid(query)){

				if(_.isEmpty(query)){
					delete this.options.search;
				}
				else{
					this.options.search = query
				}
				
				// Delete parameters //
				delete this.options.id;
				delete this.options.page;

				app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
			}
		},



		/** Sort the row of the table
		*/
		sort: function(e){

			if(!$(e.target).is('i')){
				var sortBy = $(e.target).data('sort-column');
			}
			else{
				var sortBy = $(e.target).parent('th').data('sort-column');	
			}

			// Retrieve the current Sort //
			var currentSort = this.options.sort;


			// Calcul the sort Order //
			var sortOrder = '';
			if(sortBy == currentSort.by){
				if(currentSort.order == 'ASC'){
					sortOrder = 'DESC';
				}
				else{
					sortOrder = 'ASC';
				}
			}
			else{
				sortOrder = 'ASC';
			}

			// Delete parameter //
			delete this.options.id;
			delete this.options.page;


			this.options.sort.by = sortBy;
			this.options.sort.order = sortOrder;

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},



		/** Build the url with the parameters
		*/
		urlBuilder: function(){
			var self = this;

			// Retrieve the baseurl of the view //
			var moduleName = _(Backbone.history.fragment).strLeft('/');

			var pageUrl = _(_(Backbone.history.fragment).strRight('/')).strLeft('/');

			var url = _.join('/', moduleName, pageUrl);


			// Iterate all urlParameters //
			_.each(this.urlParameters, function(value, index){


				// Check if the options parameter aren't undefined or null //
				if(!_.isUndefined(self.options[value]) && !_.isNull(self.options[value])){


					// Check if the value of the parameter is not an object //
					if(!_.isObject(self.options[value])){

						url += '/'+value+'/'+self.options[value];
					}
					else{

						// Check if the value is the page //
						if(value == 'page'){
							url += '/'+value+self.options[value].page;
						}
						else{

							var params = '';
							_.each(self.options[value], function(value, item){
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



		isQueryValid: function(query){
			var forbiddenChars = ['/', '%', '$'];

			var result = true;

			_.each(forbiddenChars, function(itemChar, index){

				if(_.include(query, itemChar)){
					result = false;
				}
			})
		
			return result;
		}

	});

return GenericListView

});