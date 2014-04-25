/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'consumableModel',
	'modalConsumableView',
	'modalDeleteView'


], function(app, AppHelpers, ConsumableModel, ModalConsumableView, ModalDeleteView){

	'use strict';

	/******************************************
	* Row  Consumable View
	*/
	var itemConsumableView = Backbone.View.extend({

		tagName      : 'tr',

		className    : 'row-item',

		templateHTML : 'templates/items/itemConsumable.html',


		// The DOM events //
		events: {
			'click'                         : 'modalUpdateConsumable',
			'click a.modalDeleteConsumable' : 'modalDeleteConsumable'
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
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.consumableUpdateOk);
		},



		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				app.views.consumablesListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.infoMessages.consumableDeleteOk);

		},



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Retrieve the template //
			$.get( this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang : app.lang,
					consumable  : self.model
				});

				$(self.el).html(template);

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();
			});

			return this;
		},



		/** Display Modal form to add/sav a new 
		*/
		modalUpdateConsumable: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalConsumableView = new ModalConsumableView({
				el      : '#modalSaveConsumable',
				model   : this.model,
				elFocus : $(e.target).data('form-id')
			});
		},



		/** Modal to remove a 
		*/
		modalDeleteConsumable: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalDeleteView = new ModalDeleteView({
				el           : '#modalDeleteConsumable',
				model        : this.model,
				modalTitle   : app.lang.viewsTitles.delete,
				modalConfirm : app.lang.warningMessages.confirmDelete
			});
		},


	});

	return itemConsumableView;

});