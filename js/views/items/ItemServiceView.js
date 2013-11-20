define([
	'app',
	'appHelpers',

	'claimersServicesCollection',
	'claimerServiceModel',
	'officerModel',
	
	'genericListView',
	'paginationView',
	'modalServiceView',
	'modalDeleteView'
	 


], function(app, AppHelpers, ClaimersServicesCollection, ClaimerServiceModel, OfficerModel, GenericListView, PaginationView, ModalServiceView,ModalDeleteView){

	'use strict';

	
	
	/******************************************
	* Row Service View
	*/
	var ItemServiceView = Backbone.View.extend({
	
		tagName      : 'tr',
	
		className    : 'row-item',
	
		templateHTML : 'items/itemService',
	
	
		// The DOM events //
		events: {
			'click a.collapseLink'       : 'collapseOfficers',
			'click'                      : 'modalUpdateService',
			'click a.modalDeleteService' : 'modalDeleteService'
		},
	
	
	
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
	
			this.model.off();
	
			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
	
			// When the model are destroy //
			this.listenTo(this.model, 'destroy', this.destroy);
		},
	
	
	
		/** When the model is updated //
		*/
		change: function(model){
	
			this.model = model;
	
			this.render();
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.serviceUpdateOk);
		},
	
	
	
		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;
	
			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				app.views.servicesListView.partialRender();
			});
	
			app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.infoMessages.serviceDeleteOk);
			
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
			// Retrieve the template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
	
				var template = _.template(templateData, {
					lang    : app.lang,
					service : self.model
				});
	
				$(self.el).html(template);
	
				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();
			});
	
			return this;
		},
	
	
	
		/** Display Modal form to add/sav a new service
		*/
		modalUpdateService: function(e){
			e.preventDefault(); e.stopPropagation();
	
			console.log('Update du service');
	
			app.views.modalServiceView = new ModalServiceView({
				el      : '#modalSaveService',
				model   : this.model,
				elFocus : $(e.target).data('form-id')
			});
		},
	
	
	
		/** Modal to remove a service
		*/
		modalDeleteService: function(e){
			e.preventDefault(); e.stopPropagation();
	
			app.views.modalDeleteView = new ModalDeleteView({
				el           : '#modalDeleteService',
				model        : this.model,
				modalTitle   : app.lang.viewsTitles.deleteService,
				modalConfirm : app.lang.warningMessages.confirmDeleteService
			});
		},
	
	
	
		/** Display or not the Officer List
		*/
		collapseOfficers: function(e){
			e.preventDefault(); e.stopPropagation();
	
			this.options.officersListView.collapse();
		}
	
	});
	
	return ItemServiceView;
})