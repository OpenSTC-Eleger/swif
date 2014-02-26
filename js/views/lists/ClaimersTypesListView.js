/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app', 'appHelpers', 'claimersTypesCollection', 'claimerTypeModel', 'genericListView', 'paginationView', 'itemClaimerTypeView', 'modalClaimerTypeView'],
	function (app, AppHelpers, ClaimersTypesCollection,  ClaimerTypeModel, GenericListView, PaginationView, ItemClaimerTypeView, ModalClaimerTypeView) {

		'use strict';

		return  GenericListView.extend({

			templateHTML: 'templates/lists/claimersTypesList.html',
			model		: ClaimerTypeModel,


			// The DOM events //
			events: function () {
				return _.defaults({
						'click a.modalCreateClaimerType': 'modalCreateClaimerType',
					},
					GenericListView.prototype.events
				);
			},


			/** View Initialization
			 */
			initialize: function () {
				// Check if the collections is instantiate //
				if(_.isUndefined(this.collection)){ this.collection = new ClaimersTypesCollection(); }
				
				GenericListView.prototype.initialize.apply(this, arguments);
			},


			/** When the model ara created //
			 */
			add: function (model) {

				var itemClaimerTypeView = new ItemClaimerTypeView({ model: model });
				$('#rows-items').prepend(itemClaimerTypeView.render().el);
				AppHelpers.highlight($(itemClaimerTypeView.el));

				app.notify('', 'success', app.lang.infoMessages.information, model.getName() + ' : ' + app.lang.infoMessages.claimerTypeCreateOk);
				this.partialRender();
			},
			
			/** Display the view
			*/
			render: function () {
				var self = this;

				// Change the page title //
				app.router.setPageTitle(app.lang.viewsTitles.claimersTypesList);


				// Retrieve the template //
				$.get(this.templateHTML, function (templateData) {
					var template = _.template(templateData, {
						lang: app.lang,
						nbClaimersTypes: self.collection.cpt
					});

					$(self.el).html(template);

					// Call the render Generic View //
					GenericListView.prototype.render.apply(self);

					// Create item category request view //
					_.each(self.collection.models, function (claimerType) {
						var itemClaimerTypeView = new ItemClaimerTypeView({model: claimerType});
						$('#rows-items').append(itemClaimerTypeView.render().el);
					});

				});

				$(this.el).hide().fadeIn();

				return this;
			},


			/** Modal form to create a new Cat
			*/
			modalCreateClaimerType: function (e) {
				e.preventDefault();

				app.views.modalClaimerTypeView = new ModalClaimerTypeView({
					el: '#modalSaveClaimerType'
				});
			},

		});


	});
