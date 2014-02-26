/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'absentTypesCollection',
	'absentTypeModel',

	'genericListView',
	'paginationView',
	'itemAbsentTypeView',
	'modalAbsentTypeView'

], function(app, AppHelpers, AbsentTypesCollection, AbsentTypeModel, GenericListView, PaginationView ,ItemAbsentTypeView ,ModalAbsentTypeView ){

	'use strict';


	/******************************************
	* Absent Type View - Configuration
	*/
	var absentTypesListView = GenericListView.extend({

		templateHTML: '/templates/lists/absentTypesList.html',

		model : AbsentTypeModel,
		
		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalCreateAbsentType' : 'modalCreateAbsentType',
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function (params) {
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new AbsentTypesCollection(); }
			
			
			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** When the model ara created //
		*/
		add: function(model){

			var itemAbsentTypeView  = new ItemAbsentTypeView({ model: model });
			$('#rows-items').prepend(itemAbsentTypeView.render().el);
			AppHelpers.highlight($(itemAbsentTypeView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.absentTypeCreateOk);
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.absentTypesList);



			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang         : app.lang,
					nbAbsentTypes: self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);
				
				// Create item category request view //
				_.each(self.collection.models, function(absentType){
					var itemAbsentTypeView  = new ItemAbsentTypeView({model: absentType});
					$('#rows-items').append(itemAbsentTypeView.render().el);
				});
			});

			$(this.el).hide().fadeIn();

			return this;
		},

		/** Modal form to create a new Cat
		*/
		modalCreateAbsentType: function(e){
			e.preventDefault();

			app.views.modalAbsentTypeView = new ModalAbsentTypeView({
				el  : '#modalSaveAbsentType'
			});
		},

	});


	return absentTypesListView;

});