define([
	'app',
	'appHelpers',

	'modalEquipmentView',
	'modalDeleteView'

], function(app, AppHelpers, ModalEquipmentView, ModalDeleteView){

	'use strict';


	/******************************************
	* Row ItemEquipment View
	*/
	var ItemEquipmentView = Backbone.View.extend({

		tagName     : 'tr',

		className   : 'row-item',

		templateHTML : 'templates/items/itemEquipment.html',
		


		// The DOM events //
		events       : {
			'click a.modalDeleteEquipment' : 'modalDeleteEquipment',
			'click a.modalSaveEquipment'   : 'modalSaveEquipment',
		},



		/** View Initialization
		*/
		initialize : function() {
			this.model.off();
			
			// When the model are updated  or deleted //
			this.listenTo(this.model, 'change', this.change);
			this.listenTo(this.model, 'destroy', this.destroy);
		},



		/** When the model ara updated //
		*/
		change: function(){
			this.render();
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.equipmentUpdateOk);

		},



		destroy: function(){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				app.views.equipmentsListView.partialRender();

			});

			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.equipmentDeleteOk);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Retrieve the template // 
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					equipment : self.model
				});

				$(self.el).html(template);

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();
			});

			return this;
		},



		/** Modal to update an Equipment
		*/
		modalSaveEquipment: function(){
			new ModalEquipmentView({
				model     : this.model,
				el        :'#modalSaveEquipment',

			});
		},



		/** Modal to remove an Equipment
		*/
		modalDeleteEquipment: function(){
			new ModalDeleteView({
				el          :'#modalDeleteEquipment',
				model       :this.model,
				modalTitle  : app.lang.viewsTitles.deleteEquipment,
				modalConfirm: app.lang.warningMessages.confirmDeleteEquipment
			});
		},
		
	});

	return ItemEquipmentView;

});