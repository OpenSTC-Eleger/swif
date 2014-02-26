/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

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
		
		model: PlaceModel,


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
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new PlacesCollection(); }
			
			
			GenericListView.prototype.initialize.apply(this, arguments);
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
				GenericListView.prototype.render.apply(self);


				// Create item place view //
				_.each(self.collection.models, function(place){
					var itemPlaceView  = new ItemPlaceView({model: place});
					$('#rows-items').append(itemPlaceView.render().el);
				});

			});

			$(this.el).hide().fadeIn();

			return this;
		},


		/** Modal form to create a new Place
		*/
		modalCreatePlace: function(e){
			e.preventDefault();

			app.views.modalPlaceView = new ModalPlaceView({
				el  : '#modalSavePlace'
			});
		},

	});

	return PlacesListView;

});