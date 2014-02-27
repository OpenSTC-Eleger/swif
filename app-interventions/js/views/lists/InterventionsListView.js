/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'interventionsCollection',
	'interventionModel',
	'tasksCollection',

	'genericListView',
	'paginationView',
	'itemInterventionView',
	'itemInterventionTaskListView',
	'modalInterventionView'

], function(app, AppHelpers, InterventionsCollection, InterventionModel, TasksCollection, GenericListView, PaginationView, ItemInterventionView, ItemInterventionTaskListView, ModalInterventionView){

	'use strict';


	/******************************************
	* Interventions List View
	*/
	var InterventionsListView = GenericListView.extend({

		templateHTML: '/templates/lists/interventionsList.html',


		model: InterventionModel,

		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.createModel'  : 'modalCreateInter'
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize : function() {
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new InterventionsCollection(); }

			GenericListView.prototype.initialize.apply(this, arguments);
		},

		/**
		 * Add Intervention view
		 */
		add: function(model){
			var detailedView =new ItemInterventionTaskListView({model: model});
			var simpleView = new ItemInterventionView({model: model, detailedView:detailedView});
			$('#inter-items').prepend( detailedView.render().el );
			$('#inter-items').prepend( simpleView.render().el );
			simpleView.detailedView = detailedView;
			detailedView.fetchData();
			AppHelpers.highlight($(simpleView.el)).done(function(){
				simpleView.expendAccordion();
			});

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.interventionSaveOK);

			this.partialRender();
		},

		/** Display the view
		*/
		render : function() {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.interventionsMonitoring);

			// Retrieve the HTML template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang                   : app.lang,
					nbInterventionsPending : self.collection.specialCpt,
					nbInterventionsPlanned : self.collection.specialCpt2,
					interventionsState     : InterventionModel.status,
					interventions          : self.collection,
					cityLogo               : app.config.medias.cityLogo
				});


				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);

				// Create item intervention view //
				_.each(self.collection.models, function(model){
					var detailedView =new ItemInterventionTaskListView({model: model});
					var simpleView = new ItemInterventionView({model: model, detailedView:detailedView});
					$('#inter-items').append( detailedView.render().el );
					$('#inter-items').append( simpleView.render().el );

					simpleView.detailedView = detailedView;
				});

				$(this.el).hide().fadeIn();

			});
			return this;
		},


		/** Display the form to add / update an intervention
		*/
		displayModalSaveInter: function(e){
			e.preventDefault();
			var params = {el:'#modalSaveInter',collection: this.collection};
			new ModalInterventionView(params);
		},


		/** Modal form to create a new Inter
		*/
		modalCreateInter: function(e){
			e.preventDefault();

			app.views.modalInterView = new ModalInterventionView({
				el : '#modalInter',
				collection: this.collection,
			});
		},
	});

	return InterventionsListView;
});
