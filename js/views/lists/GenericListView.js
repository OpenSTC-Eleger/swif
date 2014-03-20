/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'metaDataModel',
	'filterModel',

	'advanceSearchView',
	'recordFilterView',
	'paginationView'

], function(app, AppHelpers, MetaDataModel, FilterModel, AdvanceSearchView, RecordFilterView, PaginationView){

	'use strict';



	/******************************************
	* Generic List View
	*/
	var GenericListView = Backbone.View.extend({

		el                 : '#rowContainer',

		urlParameters      : ['id', 'search', 'filter', 'sort', 'page'],

		searchForm         : 'form.form-search input',

		genericTemplateHTML: 'templates/others/headerListView.html',

		specialDomain      : {},


		// The DOM events //
		events: {
			'click form.form-search input'                   : 'selectSearchInput',
			'submit form.form-search'                        : 'search',

			'click button[data-toggle="advance-search"]'     : 'toggleAdvanceSearch',
			'click #displayRecordFilters'                    : 'displayRecordFilters',

			'click table.table-sorter th[data-sort-column]'  : 'sort',

			'click .unapply-filter'                          : 'unapplyFilter'
		},


		initialize: function() {
			var self = this;

			this.options = arguments[0];

			this.initFilters().done(function(){
				self.initCollections().done(function(){
					// Unbind & bind the collection //
					self.collection.off();
					self.listenTo(self.collection, 'add', self.add);
					self.listenTo(self.collection, 'reset', self.render);

					//Set Meta Data for request collection to compute recording filters
					self.metaDataModel = new MetaDataModel({ id: self.collection.modelId });
					app.router.render(self);
				});
			});
		},


		/** View Initialization
		*/
		render: function() {
			var self = this;


			// Retrieve the template //
			$.get(this.genericTemplateHTML, function(templateData){

				var template = _.template(templateData, {
					lang             : app.lang,
					searchableFields : self.model.prototype.searchable_fields,
					buttonAction     : self.buttonAction
				});

				$('#headerList').html(template);


				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip({container: 'body'});

				// Set the sort icon in the table columns //
				$('th[data-sort-column]').append('<i class="fa fa-sort fa-lg text-muted pull-right">');

				// Add icon to the sorted column //
				if( !_.isUndefined(self.options.sort) ){

					// Display sort icon if there is a sort //
					var newIcon;
					if(self.options.sort.order == 'ASC'){ newIcon = 'fa-sort-up'; } else{ newIcon = 'fa-sort-down'; }

					$('th[data-sort-column="'+self.options.sort.by+'"] > i').removeClass('fa-sort text-muted').addClass('active ' + newIcon);
				}


				// Rewrite the research in the form //
				if(!_.isUndefined(self.options.search)){
					$(self.searchForm).val(self.options.search);
				}


				// Set the focus to the search form //
				$(self.searchForm).focus();


				// Create the advanceSearch View //
				app.views.advanceSearchView = new AdvanceSearchView({
					collection : self.collection,
					view       : self
				});



				if(!_.isUndefined(self.metaDataModel)){

					// Advanced recording filters view //
					app.views.recordFilterView = new RecordFilterView({
						el            : '#savedFilters',
						states        : self.model.status,
						metaDataModel : self.metaDataModel,
						listView      : self
					});
				}



				// Rewrite the research in the form //
				if(!_.isUndefined(self.options.filter)){
					// Filter advanced view needs collection setted in Generic //
					self.displayAdvanceSearch(self.options.filter);
				}

				// Pagination view //
				app.views.paginationView = new PaginationView({
					page        : self.options.page.page,
					collection  : self.collection,
					itemsPerPage: self.itemsPerPage
				});

			});

		},



		/** Partial Render of the view
		*/
		partialRender: function () {
			var self = this;

			app.views.paginationView.render();

			$.when(this.collection.count(this.getParams()), this.collection.specialCount(), this.collection.specialCount2())
				.done(function(){

					$('#badge').html(self.collection.cpt);
					$('#specialBadge').html(self.collection.specialCpt);
					$('#specialBadge2').html(self.collection.specialCpt2);
					app.views.paginationView.render();
				});
		},


		/** Init collection with url params
		*/
		initCollections: function(){

			// Fetch the collections //
			return $.when(this.collection.fetch(this.getParams()))
				.fail(function(e){
					console.log(e);
				});
		},


		/** Retrieve params
		*/
		getParams: function(){

			// Check the parameters //
			if(_.isUndefined(this.options.sort)){
				this.options.sort = this.collection.default_sort;
			}
			else{
				this.options.sort = AppHelpers.calculPageSort(this.options.sort);
			}


			var itemsPerPage = app.config.itemsPerPage;
			if(!_.isUndefined(this.itemsPerPage)){
				itemsPerPage = this.itemsPerPage;
			}

			this.options.page = AppHelpers.calculPageOffset(this.options.page, itemsPerPage);


			// Create Fetch params //
			var fetchParams = {
				silent     : true,
				data       : {
					limit  : itemsPerPage,
					offset : this.options.page.offset,
					sort   : this.options.sort.by+' '+this.options.sort.order
				}
			};


			var globalSearch = {};
			if(!_.isUndefined(this.options.search)){
				globalSearch.search = this.options.search;
			}

			if(!_.isUndefined(this.options.filter)){
				if(!_.isUndefined(this.filterModel) ){
					try {
						globalSearch.filter = JSON.parse(this.filterModel.toJSON().domain);
						this.options.filter = globalSearch.filter;
					}
					catch(e){
						console.log('Filter is not valid');
					}
				}
				else{
					try {
						globalSearch.filter = JSON.parse(this.options.filter);
						this.options.filter = globalSearch.filter;
					}
					catch(e){
						//console.log('Filter is already as json format');
					}
				}
			}


			// Add Special domain. EX Team list with delete_date //
			if(!_.isEmpty(this.specialDomain)){

				if(_.isUndefined(globalSearch.filter)){
					globalSearch.filter = [];
				}

				// Add the speciald Domain to the Filter //
				globalSearch.filter.push(this.specialDomain);
			}



			if(!_.isEmpty(globalSearch)){
				fetchParams.data.filters = AppHelpers.calculSearch(globalSearch, this.model.prototype.searchable_fields);
			}



			// Add filter on recurrence selected
			if(!_.isUndefined(this.options.recurrence)){
				if(_.isUndefined(fetchParams.data.filters)) {
					fetchParams.data.filters = {};
				}
				fetchParams.data.filters  = _.toArray(fetchParams.data.filters);
				fetchParams.data.filters.push({field: 'recurrence_id.id', operator: '=', value: this.options.recurrence});
				fetchParams.data.filters = app.objectifyFilters(fetchParams.data.filters);
			}

			return fetchParams;
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
					this.options.search = query;
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
			_.each(this.urlParameters, function(value){


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
							_.each(self.options[value], function(value){
								if(!_.isEmpty(params) ){
									params += '-'+value;
								}
								else{
									params += value;
								}
							});

							if( !_.isBlank(params) ){
								url += '/'+value+'/'+params;
							}
						}
					}
				}

			});

			return url;
		},



		/** Check if the search string contains special char
		*/
		isQueryValid: function(query){
			var forbiddenChars = ['/', '%', '$'];

			var result = true;

			_.each(forbiddenChars, function(itemChar){

				if(_.str.include(query, itemChar)){
					result = false;
				}
			});

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
					$('#filterContent').html(app.views.advanceSearchView.humanizeFilter());
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
			delete this.options.sort;
			delete this.options.page;
			delete this.options.search;

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},



		/** Render recording filters view
		*/
		displayRecordFilters: function(){
			app.views.recordFilterView.render();
		},



		/** Load filter model
		*/
		initFilters: function(){
			var self = this;

			var deferred = $.Deferred();

			//Resolve if there is not filter
			if (_.isUndefined( this.options.filter ) ){
				return deferred.resolve();
			}

			//Parse filter
			var filter = JSON.parse(this.options.filter);
			filter = parseInt(filter);

			if( _.isNaN(filter)){
				//Resolve if filter is not a recording filter
				deferred.resolve();
			}
			else{
				//Load saved filter model
				self.filterModel = new FilterModel({ id:  filter });
				self.filterModel.fetch().done( function(){
					deferred.resolve();
				});
			}

			return deferred;
		}



	});

	return GenericListView;

});