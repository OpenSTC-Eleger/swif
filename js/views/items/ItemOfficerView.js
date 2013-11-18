define([
	'app',
	'appHelpers',

	'officerModel',
	/*modalOfficerView,
	 modalDeleteView
	 */

	], function(app, AppHelpers,OfficerModel /*ModalOfficerView,ModalDeleteView*/){

		'use strict';

	/******************************************
	* Row Officer View
	*/
	var ItemOfficerView = Backbone.View.extend({
	
		tagName      : 'tr',
	
		className    : 'row-item',
	
		templateHTML : 'items/itemOfficer',
	
	
		// The DOM events //
		events: {
			'click a.modalUpdateOfficer' : 'modalUpdateOfficer',
			'click a.modalDeleteOfficer' : 'modalDeleteOfficer'
		},
	
	
	
		/** View Initialization
		*/
		initialize : function() {
			this.model.off();
	
			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
	
			// When the model are destroy //
			this.listenTo(this.model,'destroy', this.destroy);
		},
	
	
	
		/** When the model is updated //
		*/
		change: function(e){
	
			this.render();
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.officerUpdateOk);
		},
	
	
	
		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;
	
			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
			});
	
			app.notify('', 'success', app.lang.infoMessages.information, e.getCompleteName()+' : '+app.lang.infoMessages.officerDeleteOk);
			
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
			// Retrieve the template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
	
				var template = _.template(templateData, {
					lang    : app.lang,
					officer : self.model
				});
	
				$(self.el).html(template);
	
				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();
			});
	
			return this;
		},
	
	
	
		/** Display Modal form to add/sav a new officer
		*/
		modalUpdateOfficer: function(e){  
			e.preventDefault(); e.stopPropagation();
	
			console.log(this.model.attributes);
	
			app.views.modalOfficerView = new ModalOfficerView({
				el      : '#modalSaveOfficer',
				model   : this.model,
			});
		},
	
	
	
		/** Modal to remove an officer
		*/
		modalDeleteOfficer: function(e){
			e.preventDefault(); e.stopPropagation();
	
			app.views.modalDeleteView = new ModalDeleteView({
				el           : '#modalDeleteOfficer',
				model        : this.model,
				modalTitle   : app.lang.viewsTitles.deleteOfficer,
				modalConfirm : app.lang.warningMessages.confirmDeleteOfficer
			});
		}
	
	});
	
	return ItemOfficerView;
})