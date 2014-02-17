define([
	'app',
	'appHelpers',

	'placesCollection',
	'placeModel',

	'genericListView',
	'paginationView',
	'itemPlaceView',
	'modalPlaceView',
	'metaDataModel'


], function(app, AppHelpers, PlacesCollection, PlaceModel, GenericListView, PaginationView, ItemPlaceView, ModalPlaceView, MetaDataModel){

	'use strict';


	/******************************************
	* Places List View
	*/
	var PlacesListView = GenericListView.extend({

		templateHTML  : 'templates/lists/placesList.html',


		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.createModel' : 'modalCreatePlace',
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function (params) {
			this.options = params;

			var self = this;

			this.initFilters().done(function(){
				self.initCollection().done(function(){

					// Unbind & bind the collection //
					self.collection.off();
					self.listenTo(self.collection, 'add', self.add);

					//Set Meta Data for request collection to compute recording filters
					self.metaDataModel = new MetaDataModel({ id: self.collection.modelId });

					app.router.render(self);
				});
			});
		},



		/** When the model ara created //
		*/
		add: function(model){

			var itemPlaceView  = new ItemPlaceView({ model: model });
			$('#rows-items').prepend(itemPlaceView.render().el);
			AppHelpers.highlight($(itemPlaceView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.placeCreateOk);
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.placesList);



			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang    : app.lang,
					nbPlaces: self.collection.cpt
				});

				$(self.el).html(template);


				// Call the render Generic View //
				GenericListView.prototype.render(self, PlaceModel.prototype.searchable_fields);


				// Create item place view //
				_.each(self.collection.models, function(place){
					var itemPlaceView  = new ItemPlaceView({model: place});
					$('#rows-items').append(itemPlaceView.render().el);
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
		partialRender: function () {
			var self = this;

			this.collection.count(this.fetchParams).done(function(){
				$('#badgeNbPlaces').html(self.collection.cpt);
				app.views.paginationView.render();
			});
		},



		/** Modal form to create a new Place
		*/
		modalCreatePlace: function(e){
			e.preventDefault();

			app.views.modalPlaceView = new ModalPlaceView({
				el  : '#modalSavePlace'
			});
		},



		/** Collection Initialisation
		*/
		initCollection: function(){
			var self = this;

			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new PlacesCollection(); }


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
				silent : true,
				data   : {
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
					catch(e)
					{
						console.log('Filter is not valid');
					}

				}
				else{
					globalSearch.filter = JSON.parse(this.options.filter);
					this.options.filter = globalSearch.filter;
				}
			}

			if(!_.isEmpty(globalSearch)){
				fetchParams.data.filters = AppHelpers.calculSearch(globalSearch, PlaceModel.prototype.searchable_fields);
			}


			return $.when(self.collection.fetch(fetchParams))
				.fail(function(e){
					console.log(e);
				});
		}

	});

	return PlacesListView;

});