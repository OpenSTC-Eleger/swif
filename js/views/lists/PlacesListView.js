define([
	'app',
	'appHelpers',

	'placesCollection',
	'placeModel',

	'genericListView',
	'paginationView',
	'itemPlaceView',
	'modalPlaceView'


], function(app, AppHelpers, PlacesCollection, PlaceModel, GenericListView, PaginationView, ItemPlaceView, ModalPlaceView){

	'use strict';


	/******************************************
	* Places List View
	*/
	var PlacesListView = GenericListView.extend({

		templateHTML  : 'lists/placesList',


		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalCreatePlace' : 'modalCreatePlace',
			}, 
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function (params) {
			this.options = params;

			var self = this;

			this.initCollection().done(function(){

				// Unbind & bind the collection //
				self.collection.off();
				self.listenTo(self.collection, 'add', self.add);

				app.router.render(self);
			})
		},



		/** When the model ara created //
		*/
		add: function(model){

			var itemPlaceView  = new ItemPlaceView({ model: model });
			$('#rows-items').prepend(itemPlaceView.render().el);
			AppHelpers.highlight($(itemPlaceView.el))

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
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
				var template = _.template(templateData, {
					lang    : app.lang,
					nbPlaces: self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render(self);


				// Create item place view //
				_.each(self.collection.models, function(place, i){
					var itemPlaceView  = new ItemPlaceView({model: place});
					$('#rows-items').append(itemPlaceView.render().el);
				});


				// Pagination view //
				app.views.paginationView = new PaginationView({ 
					page       : self.options.page.page,
					collection : self.collection
				})

			});

			$(this.el).hide().fadeIn();

			return this;
		},


		/** Partial Render of the view
		*/
		partialRender: function (type) {
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
			this.fetchParams = {
				silent : true,
				data   : {
					limit  : app.config.itemsPerPage,
					offset : this.options.page.offset,
					sort   : this.options.sort.by+' '+this.options.sort.order
				}
			};
			if(!_.isUndefined(this.options.search)){
				this.fetchParams.data.filters = AppHelpers.calculSearch({search: this.options.search }, PlaceModel.prototype.searchable_fields);
			}


			return $.when(self.collection.fetch(this.fetchParams))
				.fail(function(e){
					console.log(e);
				})
		}

	});

return PlacesListView;

});