/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'categoriesTasksCollection',
	'categoryTaskModel',

	'genericListView',
	'paginationView',
	'itemCategoryTaskView',
	'modalCategoryTaskView'

], function(app, AppHelpers, CategoriesTasksCollection, CategoryTaskModel, GenericListView, PaginationView , ItemCategoryTaskView , ModalCategoryTaskView ){

	'use strict';


	/******************************************
	* Categories Tasks List View
	*/
	var categoriesTasksListView = GenericListView.extend({

		templateHTML: '/templates/lists/categoriesTasksList.html',

		model : CategoryTaskModel,

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
			if(_.isUndefined(this.collection)){ this.collection = new CategoriesTasksCollection(); }


			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** When the model ara created //
		*/
		add: function(model){

			var itemCategoryTaskView  = new ItemCategoryTaskView({ model: model });
			$('#rows-items').prepend(itemCategoryTaskView.render().el);
			AppHelpers.highlight($(itemCategoryTaskView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.catCreateOk);
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.categoriesTasksList);



			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang  : app.lang,
					nbCats: self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);

				// Create item category request view //
				_.each(self.collection.models, function(catTask){
					var itemCategoryTaskView  = new ItemCategoryTaskView({model: catTask});
					$('#rows-items').append(itemCategoryTaskView.render().el);
				});
			});

			$(this.el).hide().fadeIn();

			return this;
		},

		/** Modal form to create a new Cat
		*/
		modalCreateCat: function(e){
			e.preventDefault();

			app.views.modalCategoryTaskView = new ModalCategoryTaskView({
				el  : '#modalSaveCat'
			});
		},

	});

	return categoriesTasksListView;
});