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

	'categoriesRequestsCollection',

	'categoryRequestModel'

], function(app, AppHelpers, GenericModalView, AdvancedSelectBoxView, CategoriesRequestsCollection, CategoryRequestModel){


	'use strict';

	/******************************************
	* Category Request Modal View
	*/
	var modalCategoryRequestView = GenericModalView.extend({


		templateHTML : '/templates/modals/modalCategoryRequest.html',



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
				this.model = new CategoryRequestModel();
			}

			this.render();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					cat   : self.model
				});

				self.modal.html(template);

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
			/*this.model.setName(this.$('#catName').val(), false);
			this.model.setCode(this.$('#catCode').val(), false);*/
			var params = {
				name: this.$('#catName').val(),
				code: this.$('#catCode').val().toUpperCase()
			};


			this.model.save(params)
				.done(function(data) {
					self.modal.modal('hide');

					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : CategoriesRequestsCollection.prototype.fields} }).done(function(){
							app.views.categoriesRequestsListView.collection.add(self.model);
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

	return modalCategoryRequestView;

});