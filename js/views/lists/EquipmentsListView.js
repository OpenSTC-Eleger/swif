/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'equipmentsCollection',
	'equipmentModel',

	'genericListView',
	'paginationView',
	'itemEquipmentView',
	'modalEquipmentView'

], function(app, AppHelpers, EquipmentsCollection, EquipmentModel, GenericListView, PaginationView, ItemEquipmentView, ModalEquipmentView){

	'use strict';


	/******************************************
	* Equipments List View
	*/
	var EquipmentsListView = GenericListView.extend({

		templateHTML: 'templates/lists/equipmentsList.html',
		
		model : EquipmentModel,


		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalAddEquipment'  : 'modalCreateEquipment',
			},
				GenericListView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize: function (params) {
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collection)){ this.collection = new EquipmentsCollection(); }			
			
			GenericListView.prototype.initialize.apply(this, arguments);
		},



		/** When the model ara created //
		*/
		add: function(model){

			var itemEquipmentView  = new ItemEquipmentView({ model: model });
			$('#row-items').prepend(itemEquipmentView.render().el);
			AppHelpers.highlight($(itemEquipmentView.el));

			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.equipmentCreateOk);
			this.partialRender();
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.equipmentsList);


			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang        : app.lang,
					nbEquipments: self.collection.cpt
				});

				$(self.el).html(template);

				// Call the render Generic View //
				GenericListView.prototype.render.apply(self);


				//create ItemView for each equipment in the collection
				_.each(self.collection.models, function(equipment){
					var itemEquipmentView  = new ItemEquipmentView({model: equipment});
					$('#row-items').append(itemEquipmentView.render().el);
				});

			});

			$(this.el).hide().fadeIn();

			return this;
		},


		/** Add a new equipment
		*/
		modalCreateEquipment: function(e){
			e.preventDefault();

			app.views.ModalEquipmentView = new ModalEquipmentView({
				el  : '#modalSaveEquipment'
			});
		},

	});

	return EquipmentsListView;

});