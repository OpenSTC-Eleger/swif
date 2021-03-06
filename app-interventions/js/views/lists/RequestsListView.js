/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'requestsCollection',
	'claimersServicesCollection',
	'requestModel',

	'genericListView',
	'itemRequestView',
	'modalRequestView'

], function(app, AppHelpers, RequestsCollection, ClaimersServicesCollection, RequestModel, GenericListView, ItemRequestView, ModalRequestView) {

	'use strict';



	/******************************************
	 * Requests List View
	 */
	var RequestsListView = GenericListView.extend({

		templateHTML: '/templates/lists/requestsList.html',

		model: RequestModel,


		// The DOM events //
		events: function() {
			return _.defaults({
					'click #specialBadge[data-filter!=""]': 'badgeFilter',
					'click a.createModel'                 : 'modalCreateRequest',
				},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		 */
		initialize: function() {
			// Check if the collections is instantiate //
			if (_.isUndefined(this.collection)) { this.collection = new RequestsCollection(); }

			this.buttonAction = app.lang.actions.addRequest;
			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** When the model ara created //
		 */
		add: function(model) {
			var itemRequestView = new ItemRequestView({
				model: model
			});
			$('#rows-items').prepend(itemRequestView.render().el);
			AppHelpers.highlight($(itemRequestView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName() + ' : ' + app.lang.infoMessages.requestCreateOk);
			this.partialRender();
		},



		/** Display the view
		 */
		render: function() {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.requestsList);


			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData) {


				var template = _.template(templateData, {
					lang            : app.lang,
					nbRequests      : self.collection.cpt,
					nbRequestsToDeal: self.collection.specialCpt,
					requestsState   : self.model.status,
					user            : app.current_user
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);

				// Create item request view //
				_.each(self.collection.models, function(request) {
					var itemRequestView = new ItemRequestView({
						model: request
					});
					$('#rows-items').append(itemRequestView.render().el);
				});
			});

			$(this.el).hide().fadeIn();

			return this;
		},


		/** Filter Requests on the State of the Badge
		*/
		badgeFilter: function(e) {

			var filterValue = $(e.target).data('filter');

			// Set the filter value in the options of the view //
			if (filterValue !== '') {
				this.options.filter = [{
					field: 'state',
					operator: 'in',
					value: [filterValue]
				}];
				delete this.options.search;
				delete this.options.page;
			}

			app.router.navigate(this.urlBuilder(), {
				trigger: true,
				replace: true
			});
		},



		/** Modal form to create a new Request
		 */
		modalCreateRequest: function(e) {
			e.preventDefault();

			app.views.modalRequestView = new ModalRequestView({
				el: '#modalRequest'
			});
		}

	});


	return RequestsListView;
});