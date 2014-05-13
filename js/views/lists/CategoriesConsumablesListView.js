/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'categoriesConsumablesCollection',
	'categoryConsumableModel',

	'genericListView',
	'paginationView',
	'itemCategoryConsumableView',
	'modalCategoryConsumableView'

], function(app, AppHelpers, CategoriesConsumablesCollection, CategoryConsumableModel, GenericListView, PaginationView , ItemCategoryConsumableView , ModalCategoryConsumableView ){

	'use strict';


	/******************************************
	* Categories Consumables List View
	*/
	var categoriesConsumablesListView = GenericListView.extend({

		templateHTML: 'templates/lists/categoriesConsumablesList.html',

		model:CategoryConsumableModel,

		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalCreateCat' : 'modalCreateCat',
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function() {
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new CategoriesConsumablesCollection(); }


			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** When the model ara created //
		*/
		add: function(model){

			var itemCategoryConsumableView  = new ItemCategoryConsumableView({ model: model });
			$('#rows-items').prepend(itemCategoryConsumableView.render().el);
			AppHelpers.highlight($(itemCategoryConsumableView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.catCreateOk);
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.categoriesConsumablesList);



			// Retrieve the template //
			$.get( this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang   : app.lang,
					nbCats : self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);

				// Create item category Consumable view //
				_.each(self.collection.models, function(catConsumable){
					var itemCategoryConsumableView  = new ItemCategoryConsumableView({model: catConsumable});
					$('#rows-items').append(itemCategoryConsumableView.render().el);
				});

			});

			$(this.el).hide().fadeIn('slow');

			return this;
		},

		/** Modal form to create a new Cat
		*/
		modalCreateCat: function(e){
			e.preventDefault();

			app.views.modalCategoryConsumableView = new ModalCategoryConsumableView({
				el  : '#modalSaveCat'
			});
		},
	});

	return categoriesConsumablesListView;

});