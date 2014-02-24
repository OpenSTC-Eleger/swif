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
			this.options = params;

			var self = this;

			this.initCollection().done(function(){

				// Unbind & bind the collection //
				self.collection.off();
				self.listenTo(self.collection, 'add', self.add);

				app.router.render(self);
			});
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
				GenericListView.prototype.render(self);


				// Create item category request view //
				_.each(self.collection.models, function(catRequest){
					var itemCategoryRequestView  = new ItemCategoryRequestView({model: catRequest});
					$('#rows-items').append(itemCategoryRequestView.render().el);
				});


				// Pagination view //
				app.views.paginationView = new PaginationView({
					page       : self.options.page.page,
					collection : self.collection
				});
				app.views.paginationView.render();

			});

			$(this.el).hide().fadeIn('slow');

			return this;
		},



		/** Partial Render of the view
		*/
		partialRender: function() {
			var self = this;

			this.collection.count(this.fetchParams).done(function(){
				$('#bagdeNbCats').html(self.collection.cpt);
				app.views.paginationView.render();
			});
		},



		/** Modal form to create a new Cat
		*/
		modalCreateCat: function(e){
			e.preventDefault();

			app.views.modalCategoryRequestView = new ModalCategoryRequestView({
				el  : '#modalSaveCat'
			});
		},



		/** Collection Initialisation
		*/
		initCollection: function(){
			var self = this;

			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new CategoriesRequestsCollection(); }


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
				this.fetchParams.data.filters = AppHelpers.calculSearch({search: this.options.search }, CategoryRequestModel.prototype.searchable_fields);
			}


			return $.when(self.collection.fetch(this.fetchParams))
				.fail(function(e){
					console.log(e);
				});

		}

	});

	return categoriesRequestsListView;

});