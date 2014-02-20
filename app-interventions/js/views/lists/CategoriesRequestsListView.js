/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'categoriesRequestsCollection',
	'categoryRequestModel',

	'genericListView',
	'paginationView',
	'itemCategoryRequestView',
	'modalCategoryRequestView'

], function(app, AppHelpers, CategoriesRequestsCollection, CategoryRequestModel, GenericListView, PaginationView , ItemCategoryRequestView , ModalCategoryRequestView ){

	'use strict';


	/******************************************
	* Categories Requests List View
	*/
	var categoriesRequestsListView = GenericListView.extend({

		templateHTML: '/templates/lists/categoriesRequestsList.html',
		
		model:CategoryRequestModel,
		
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
		initialize: function (params) {
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new CategoriesRequestsCollection(); }
			
			
			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** When the model ara created //
		*/
		add: function(model){

			var itemCategoryRequestView  = new ItemCategoryRequestView({ model: model });
			$('#rows-items').prepend(itemCategoryRequestView.render().el);
			AppHelpers.highlight($(itemCategoryRequestView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.catCreateOk);
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.categoriesIntersList);



			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang   : app.lang,
					nbCats : self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);
	
				// Create item category request view //
				_.each(self.collection.models, function(catRequest){
					var itemCategoryRequestView  = new ItemCategoryRequestView({model: catRequest});
					$('#rows-items').append(itemCategoryRequestView.render().el);
				});

			});

			$(this.el).hide().fadeIn('slow');
			
	        return this;
	    },

		/** Modal form to create a new Cat
		*/
		modalCreateCat: function(e){
			e.preventDefault();

			app.views.modalCategoryRequestView = new ModalCategoryRequestView({
				el  : '#modalSaveCat'
			});
		},
	});

	return categoriesRequestsListView;

});