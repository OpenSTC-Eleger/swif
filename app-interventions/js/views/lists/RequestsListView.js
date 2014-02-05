define([
	'app',
	'appHelpers',

	'requestsCollection',
	'claimersServicesCollection',
	'requestModel',
	'filterModel',

	'genericListView',
	'paginationView',
	'itemRequestView',
	'modalRequestView',
	'advancedSelectBoxView',
	'metaDataModel',
	'recordFilterView'

], function(app, AppHelpers, RequestsCollection, ClaimersServicesCollection, RequestModel, FilterModel, GenericListView, PaginationView, 
				ItemRequestView, ModalRequestView, AdvancedSelectBoxView, MetaDataModel,  RecordFilterView){

	'use strict';


	/******************************************
	* Requests List View
	*/
	var RequestsListView = GenericListView.extend({

		templateHTML : '/templates/lists/requestsList.html',


		// The DOM events //
		events: function(){
			return _.defaults({
				'click #filterStateRequestList li a' 		: 'setFilterState',
				'click #badgeActions[data-filter!=""]'  	: 'badgeFilter',
				'click a.createRequest'		            	: 'modalCreateRequest',
				'click #displayRecordFilters'               : 'displayAdvancedFilters'
			}, 
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function (params) {
			var self = this;

			this.options = params;
			
			this.initFilters().done(function(){
				self.initCollection().done(function(){
					// Unbind & bind the collection //
					self.collection.off();
					self.listenTo(self.collection, 'add', self.add);
					self.listenTo(self.collection, 'reset', self.render);
					//Set Meta Data for request collection to compute recording filters
					self.metaDataModel = new MetaDataModel({ id :  self.collection.modelId });	
					app.router.render(self);
				});
			});


		},



		/** When the model ara created //
		*/
		add: function(model){
			var itemRequestView = new ItemRequestView({ model: model });
			$('#rows-items').prepend(itemRequestView.render().el);
			AppHelpers.highlight($(itemRequestView.el))

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.requestCreateOk);
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.requestsList);


			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang             : app.lang,
					nbRequests       : self.collection.cpt,
					nbRequestsToDeal : self.collection.specialCpt,
					requestsState    : RequestModel.status,
					searchableFields : RequestModel.prototype.searchable_fields,
					user             : app.current_user
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render(self.options);


				// Create item request view //
				_.each(self.collection.models, function(request, i){
					var itemRequestView = new ItemRequestView({model: request});
					$('#rows-items').append(itemRequestView.render().el);
				});


				// Pagination view //
				app.views.paginationView = new PaginationView({ 
					page       : self.options.page.page,
					collection : self.collection
				});


				// Advanced recording filters view //
				app.views.recordFilterView = new RecordFilterView({
					el            : '#savedFilters',
					states        : RequestModel.status,
					metaDataModel : self.metaDataModel
				});

				// Render Filter Link on the Table //
//				if(!_.isUndefined(self.options.filter)){
//
//					$('#filterStateRequest').removeClass('filter-disabled');
//					$('#filterStateRequestList li.delete-filter').removeClass('disabled');
//
//					$('a.filter-button').addClass('text-'+RequestModel.status[self.options.filter.value].color);
//				}
//				else{
//					$('#filterStateRequest').addClass('filter-disabled');
//					$('#filterStateRequestList li.delete-filter').addClass('disabled');
//				}

			});

			$(this.el).hide().fadeIn();

			return this;
		},



		/** Partial Render of the view
		*/
		partialRender: function() {
			var self = this;

			app.views.paginationView.render();

			this.collection.specialCount().done(function(){
				$('#badgeActions').html(self.collection.specialCpt);
				$('#bagdeCpt').html(self.collection.cpt);
			});
		},



		/** Filter Requests on the State
		*/
		setFilterState: function(e){
			e.preventDefault();

			if($(e.target).is('i')){
				var filterValue = _($(e.target).parent().attr('href')).strRightBack('#');
			}else{
				var filterValue = _($(e.target).attr('href')).strRightBack('#');
			}

			// Set the filter value in the options of the view //
			if(filterValue != 'delete-filter'){
				this.options.filter = { by: 'state', value: filterValue};
				delete this.options.page;
			}
			else{
				delete this.options.filter;
			}
			
			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},



		/** Filter Requests on the State of the Badge
		*/
		badgeFilter: function(e){

			var filterValue = $(e.target).data('filter');

			// Set the filter value in the options of the view //
			if(filterValue != ''){
				this.options.filter = { by: 'state', value: filterValue};
				delete this.options.search;
				delete this.options.page;
			}

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},

			
		/**
		 * Render recording filters view
		 */	
		displayAdvancedFilters: function(e){
			app.views.recordFilterView.render();
		},


		/** Modal form to create a new Request
		*/
		modalCreateRequest: function(e){
			e.preventDefault();

			app.views.modalRequestView = new ModalRequestView({
				el : '#modalRequest'
			});
		},


		initFilters: function(){
			var self = this;
			
			var deferred = $.Deferred();
			if (_.isUndefined( this.options.filter ) )
				return deferred.resolve();	
			var filter = JSON.parse(this.options.filter);
			filter = parseInt(filter);
			if( _.isNaN(filter) ) 
				deferred.resolve();		
			else{
				self.filterModel = new FilterModel({ id :  filter });
				self.filterModel.fetch().done( function(){
					deferred.resolve();
				});			
			}
			return deferred
		},

		initCollection: function(){
			var self = this;

			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new RequestsCollection(); }


			// Check the parameters //
			if(_.isUndefined(this.options.sort)){
				this.options.sort = this.collection.default_sort;
			}
			else{
				this.options.sort = AppHelpers.calculPageSort(this.options.sort);
			}

			this.options.page = AppHelpers.calculPageOffset(this.options.page);

//			if(!_.isUndefined(this.options.filter)){
//				this.options.filter = AppHelpers.calculPageFilter(this.options.filter);
//			}

				
			// Create Fetch params //
			var fetchParams = {
				silent     : true,
				data       : {
					limit  : app.config.itemsPerPage,
					offset : this.options.page.offset,
					sort   : this.options.sort.by+' '+this.options.sort.order
				}
			};


			var globalSearch = {};
			if(!_.isUndefined(this.options.search)){
				globalSearch.search = this.options.search;
			}
			
			if(!_.isUndefined(this.options.filter)){				
				if(!_.isUndefined(this.filterModel)){
					globalSearch.filter = JSON.parse(this.filterModel.toJSON().domain);
				}
				else{
					globalSearch.filter = JSON.parse(this.options.filter);
				}
			}

			if(!_.isEmpty(globalSearch)){			
				fetchParams.data.filters = AppHelpers.calculSearch(globalSearch, RequestModel.prototype.searchable_fields);
			}

			// Fetch the collections //
			return $.when(this.collection.fetch(fetchParams))
			.fail(function(e){
				console.log(e);
			});

		},

	});
	
	

	return RequestsListView;

});