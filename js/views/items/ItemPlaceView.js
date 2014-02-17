define([
	'app',
	'appHelpers',

	'modalPlaceView',
	'modalDeleteView'

], function(app, AppHelpers, ModalPlaceView, ModalDeleteView){

	'use strict';


	/******************************************
	* Row Place View
	*/
	var ItemPlaceView = Backbone.View.extend({

		tagName      : 'tr',

		className    : 'row-item',

		templateHTML : 'templates/items/itemPlace.html',


		// The DOM events //
		events: {
			'click'                    : 'modalUpdatePlace',
			'click a.modalDeletePlace' : 'modalDeletePlace'
		},



		/** View Initialization
		*/
		initialize : function() {
			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);

			// When the model are destroy //
			this.listenTo(this.model,'destroy', this.destroy);
		},



		/** When the model is updated //
		*/
		change: function(){

			this.render();
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.placeUpdateOk);
		},



		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				app.views.placesListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getCompleteName()+' : '+app.lang.infoMessages.placeDeleteOk);

		},



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					place : self.model
				});

				$(self.el).html(template);

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();
			});

			return this;
		},



		/** Display Modal form to add/sav a new place
		*/
		modalUpdatePlace: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalPlaceView = new ModalPlaceView({
				el      : '#modalSavePlace',
				model   : this.model,
				elFocus : $(e.target).data('form-id')
			});
		},



		/** Modal to remove a place
		*/
		modalDeletePlace: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalDeleteView = new ModalDeleteView({
				el           : '#modalDeletePlace',
				model        : this.model,
				modalTitle   : app.lang.viewsTitles.deletePlace,
				modalConfirm : app.lang.warningMessages.confirmDeletePlace
			});
		},

	});

	return ItemPlaceView;

});