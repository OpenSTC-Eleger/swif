/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'genericModalView',
	'advancedSelectBoxView',

	'categoriesConsumablesCollection',
	'claimersServicesCollection',

	'categoryConsumableModel'

], function(app, AppHelpers, GenericModalView, AdvancedSelectBoxView, CategoriesConsumablesCollection, ClaimersServicesCollection, CategoryConsumableModel){


	'use strict';

	/******************************************
	* Category Consumable Modal View
	*/
	var modalCategoryConsumableView = GenericModalView.extend({


		templateHTML : 'templates/modals/modalCategoryConsumable.html',



		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formSaveCat'  : 'saveCat'
			},
				GenericModalView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.modal = $(this.el);

			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){
				this.model = new CategoryConsumableModel();
			}

			this.render();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get( this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					cat   : self.model
				});

				self.modal.html(template);
				
				app.views.advancedSelectBoxCatParentView = new AdvancedSelectBoxView({el: $('#catParent'), url: CategoriesConsumablesCollection.prototype.url });
				if(!self.model.isNew()){
					app.views.advancedSelectBoxCatParentView.setSearchParam({ field: 'id', operator: '!=', value: self.model.getId() }, true);
				}
				app.views.advancedSelectBoxCatParentView.render();

				app.views.advancedSelectBoxCatServices = new AdvancedSelectBoxView({el: $('#catServices'), url: ClaimersServicesCollection.prototype.url });
				app.views.advancedSelectBoxCatServices.render();

				self.modal.modal('show');
			});

			return this;
		},



		/** Delete the model pass in the view
		*/
		saveCat: function(e){
			e.preventDefault();

			var self = this;

			// Set the button in loading State //
			$(this.el).find('button[type=submit]').button('loading');


			// Set the properties of the model //
			var params = {
				name: this.$('#catName').val(),
				code: this.$('#catCode').val().toUpperCase(),
				price: this.$('#catPrice').val().toUpperCase(),
				//consumable_parent_id: app.views.advancedSelectBoxCatParentView.getSelectedItem(),
				service_ids: [[6, 0, app.views.advancedSelectBoxCatServices.getSelectedItems()]],
			};


			this.model.save(params)
				.done(function(data) {
					self.modal.modal('hide');

					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : CategoriesConsumablesCollection.prototype.fields} }).done(function(){
							app.views.categoriesConsumablesListView.collection.add(self.model);
						});
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
				})
				.fail(function (e) {
					AppHelpers.printError(e);
				})
				.always(function () {
					$(self.el).find('button[type=submit]').button('reset');
				});
		},

	});

	return modalCategoryConsumableView;

});