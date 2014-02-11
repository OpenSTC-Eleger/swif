define([
	'app',
	
	'metaDataModel',

	'advanceSearchView',
	'recordFilterView'
	
	
], function(app, MetaDataModel, AdvanceSearchView, RecordFilterView){


	/******************************************
	* Generic List View
	*/
	var GenericListView = Backbone.View.extend({

		el            : '#rowContainer',

		urlParameters : ['id', 'search', 'filter', 'sort', 'page'],

		searchForm    : 'form.form-search input',


		// The DOM events //
		events: {
			'click form.form-search input'                   : 'selectSearchInput',
			'submit form.form-search'                      	 : 'search',

			'click button[data-toggle="advance-search"]'     : 'toggleAdvanceSearch',
			'click table.table-sorter th[data-sort-column]'  : 'sort',

			'click .unapply-filter'                          : 'unapplyFilter'
		},



		/** View Initialization
		*/
		render: function(childView) {


			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();

			// Set the sort icon in the table columns //
			$('th[data-sort-column]').append('<i class="fa fa-sort fa-lg text-muted pull-right">');

			// Add icon to the sorted column //
			if( !_.isUndefined(childView.options.sort) ){

				// Display sort icon if there is a sort //
				if(childView.options.sort.order == 'ASC'){ var newIcon = 'fa-sort-up'; } else{ var newIcon = 'fa-sort-down'; }
				$("th[data-sort-column='"+childView.options.sort.by+"'] > i").removeClass('fa-sort text-muted').addClass('active ' + newIcon);
			}


			// Rewrite the research in the form //
			if(!_.isUndefined(childView.options.search)){
				$(this.searchForm).val(childView.options.search);
			}


			// Set the focus to the search form //
			$('form.form-search input').focus();


			// Create the advanceSearch View //
			app.views.advanceSearchView = new AdvanceSearchView({
				collection : childView.collection,
				view       : childView
			});


			// Rewrite the research in the form //
			if(!_.isUndefined(childView.options.filter)){
				this.displayAdvanceSearch(childView.options.filter);
			}

		},



		/** Select the value in the search input when it is focus
		*/
		selectSearchInput: function(e){
			$(e.target).select();
		},



		/** Perform a search on the list
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
				delete this.options.page;

				app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
			}
		},



		/** Sort the row of the table
		*/
		sort: function(e){

			// Get the sort column click //
			var sortBy = $(e.currentTarget).data('sort-column');


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


			if(pageUrl == app.config.menus.openbase){
				pageUrl = pageUrl + '/' + _(_(_(Backbone.history.fragment).strRight('/')).strRight('/')).strLeft('/');
			}


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
						else if(value == 'filter'){
							url += '/'+value+'/'+JSON.stringify(self.options[value]);
						}
						else{

							var params = '';
							_.each(self.options[value], function(value, item){
								if(!_.isEmpty(params) ){
									params += '-'+value;
								}
								else{
									params += value;
								}
							})
							if( !_.isBlank(params) )
								url += '/'+value+'/'+params;
						}
					}
				}

			})

			return url;
		},



		/** Check if the search string contains special char
		*/
		isQueryValid: function(query){
			var forbiddenChars = ['/', '%', '$'];

			var result = true;

			_.each(forbiddenChars, function(itemChar, index){

				if(_.str.include(query, itemChar)){
					result = false;
				}
			})
		
			return result;
		},



		/** Apply advanced search
		*/
		applyAdvancedFilters: function(jsonFilters) {
			if(_.isEmpty(jsonFilters)){
				delete this.options.filter;
			}
			else{
				this.options.filter = jsonFilters;
			}
			
			// Delete parameters //
			delete this.options.page;
			delete this.options.search;

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
			
		},



		/** Display or hide the Advance Search Box
		*/
		toggleAdvanceSearch: function(e){

			// Set the button to active //
			$(e.currentTarget).toggleClass('active');

			$('#advanceFilterContainer').toggleClass('hide');
			$('#contentContainer').toggleClass('content-main-left');



			// Create the advance filter View //
			if(!$('#advanceFilterContainer').hasClass('hide')){
				app.views.advanceSearchView.render(this.options.filter);
				$('#filter-informations').addClass('hide');
			}
			else{

				// Display the informations filters if the advanceSearchView is collapse //
				if(!_.isUndefined(this.options.filter)){
					$('#filter-informations').removeClass('hide');
					this.humanizeFilter(this.options.filter);
				}
			}
		},



		/** Display the advance filter //
		*/
		displayAdvanceSearch: function(filter){

			$('button[data-toggle="advance-search"]').addClass('active');
			$('#advanceFilterContainer').removeClass('hide');
			$('#contentContainer').addClass('content-main-left');

			app.views.advanceSearchView.render(filter);
		},



		/** Unapply the filter
		*/
		unapplyFilter: function(e){
			e.preventDefault();

			delete this.options.filter;
			delete this.options.page;
			delete this.options.search;

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},



		/** Transform JSON filter to readable String
		*/
		humanizeFilter: function(filter){

			var string = '';

			_.each(this.collection.advanced_searchable_fields, function(field){
			
				var f = _.filter(filter, function(f){
					if(f.field == field.key){
						f.type = field.type;
						f.label = field.label;

						return f;
					}
				});

				if(!_.isEmpty(f)){
					string += f[0].label +" "+ f[0].operator +" "+f[0].value +" && ";
				}
			});


			$('#filterContent').html(string);

		}
		

	});

	return GenericListView

});