/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'requestsCollection',
	'claimersServicesCollection',
	'requestModel',

	'genericListView',
	'paginationView',
	'itemRequestView',
	'modalRequestView',
	'advancedSelectBoxView',
	'metaDataModel'

], function(app, AppHelpers, RequestsCollection, ClaimersServicesCollection, RequestModel, GenericListView, PaginationView,
				ItemRequestView, ModalRequestView, AdvancedSelectBoxView, MetaDataModel){

	'use strict';


	/******************************************
	* Requests List View
	*/
	var RequestsListView = GenericListView.extend({

		templateHTML : '/templates/lists/requestsList.html',


		// The DOM events //
		events: function(){
			return _.defaults({
				'click #badgeActions[data-filter !=""]' : 'badgeFilter',

				'click a.createModel'            : 'modalCreateRequest'
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function(params) {
			var self = this;

			this.options = params;

			this.modelState = RequestModel.status;

			this.initFilters().done(function(){
				self.initCollection().done(function(){

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



		/** When the model ara created //
		*/
		add: function(model){
			var itemRequestView = new ItemRequestView({ model: model });
			$('#rows-items').prepend(itemRequestView.render().el);
			AppHelpers.highlight($(itemRequestView.el));

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
					requestsState    : self.modelState,
					user             : app.current_user
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render(self, RequestModel.prototype.searchable_fields);


				// Create item request view //
				_.each(self.collection.models, function(request){
					var itemRequestView = new ItemRequestView({model: request});
					$('#rows-items').append(itemRequestView.render().el);
				});


				// Pagination view //
				app.views.paginationView = new PaginationView({
					page       : self.options.page.page,
					collection : self.collection
				});

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



		/** Filter Requests on the State of the Badge
		*/
		badgeFilter: function(e){

			var filterValue = $(e.target).data('filter');

			// Set the filter value in the options of the view //
			if(filterValue !== ''){
				this.options.filter = [{field: 'state', operator: 'in', value: [filterValue] }];
				delete this.options.search;
				delete this.options.page;
			}

			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
		},



		/** Modal form to create a new Request
		*/
		modalCreateRequest: function(e){
			e.preventDefault();

			app.views.modalRequestView = new ModalRequestView({
				el : '#modalRequest'
			});
		},



		/** Collection initialisation
		*/
		initCollection: function(){
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
					globalSearch.filter = JSON.parse(this.options.filter);
					this.options.filter = globalSearch.filter;
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