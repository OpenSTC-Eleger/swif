/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'consumablesCollection',
	'consumableModel',

	'genericListView',
	'paginationView',
	'itemConsumableView',
	'modalConsumableView'

], function(app, AppHelpers, ConsumablesCollection, ConsumableModel, GenericListView, PaginationView , ItemConsumableView , ModalConsumableView ){

	'use strict';


	/******************************************
	*  Consumables List View
	*/
	var ConsumablesListView = GenericListView.extend({

		templateHTML: 'templates/lists/consumablesList.html',

		model:ConsumableModel,

		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalCreateConsumable' : 'modalCreateConsumable',
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function() {
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new ConsumablesCollection(); }


			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** When the model ara created //
		*/
		add: function(model){

			var itemConsumableView  = new ItemConsumableView({ model: model });
			$('#rows-items').prepend(itemConsumableView.render().el);
			AppHelpers.highlight($(itemConsumableView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.consumableCreateOk);
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.consumablesList);



			// Retrieve the template //
			$.get( this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang   : app.lang,
					nbConsumables : self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);

				// Create item  Consumable view //
				_.each(self.collection.models, function(consumableConsumable){
					var itemConsumableView  = new ItemConsumableView({model: consumableConsumable});
					$('#rows-items').append(itemConsumableView.render().el);
				});

			});

			$(this.el).hide().fadeIn('slow');

			return this;
		},

		/** Modal form to create a new Consumable
		*/
		modalCreateConsumable: function(e){
			e.preventDefault();

			app.views.modalConsumableView = new ModalConsumableView({
				el  : '#modalSaveConsumable'
			});
		},
	});

	return ConsumablesListView;

});