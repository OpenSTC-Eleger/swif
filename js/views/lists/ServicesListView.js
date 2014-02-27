/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'claimersServicesCollection',
	'claimerServiceModel',
	'officerModel',

	'genericListView',
	'paginationView',
	'itemServiceView',
	'modalServiceView',
	'officersListView'


], function(app, AppHelpers, ClaimersServicesCollection, ClaimerServiceModel, OfficerModel, GenericListView, PaginationView,ItemServiceView,ModalServiceView, OfficersListView){

	'use strict';


	/******************************************
	* Services List View
	*/
	var ServicesListView = GenericListView.extend({

		templateHTML: 'templates/lists/servicesList.html',
		
		model : ClaimerServiceModel,


		// The DOM events  //
		events: function(){
			return _.defaults({
				'click a.modalCreateService' : 'modalCreateService',
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function () {
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new ClaimersServicesCollection(); }
			
			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** When the model ara created //
		*/
		add: function(model){

			var officersListView = new OfficersListView({model: model});
			var itemServiceView  = new ItemServiceView({ model: model, officersListView: officersListView });

			$('#rows-items').prepend(officersListView.render().el);
			$('#rows-items').prepend(itemServiceView.render().el);


			AppHelpers.highlight($(itemServiceView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.serviceCreateOk);
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.servicesList);



			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang      : app.lang,
					nbServices: self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);


				// Create item service view //
				_.each(self.collection.models, function(service){

					var officersListView = new OfficersListView({model: service});
					var itemServiceView  = new ItemServiceView({model: service, officersListView: officersListView});

					$('#rows-items').append(itemServiceView.render().el);
					$('#rows-items').append(officersListView.render().el);
				});

			});

			$(this.el).hide().fadeIn();

			return this;
		},


		/** Modal form to create a new Service
		*/
		modalCreateService: function(e){
			e.preventDefault();

			app.views.modalServiceView = new ModalServiceView({
				el  : '#modalSaveService'
			});
		},

	});

	return ServicesListView;
});