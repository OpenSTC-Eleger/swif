define([
	'app',
	'appHelpers',

	'bookingModel',
	'bookingRecurrenceModel',
	
	'modalUpdateBookingsListView'

], function(app, AppHelpers, BookingModel, BookingRecurrenceModel, ModalUpdateBookingsListView){

	'use strict';


	/******************************************
	* Row Intervention View
	*/
	var toolbarButtonsView = Backbone.View.extend({
	
		el              : '#toolbar-buttons',
	
		templateHTML : '/templates/others/toolbarButtons.html',
		
	
		// The DOM events //
		events       : {
			'click .actions'						: 'updateOccurences',
			'click #unbindOccurences'           	: 'unbindOccurences',	
		},
	
	
	
		/** View Initialization
		*/
		initialize : function(params) {			
			this.options = params;
			var self = this
			
			
			if( !_.isUndefined( app.views.bookingsListView.options.recurrence )) {
				this.model = new BookingRecurrenceModel({id: app.views.bookingsListView.options.recurrence });
				this.model.fetch().done(function(model){
					self.listenTo(self.model, 'change', self.change);
					_.each(self.options.collection.models, function(model){
						self.listenTo(model, 'change', self.initialize);
					})					
					self.render();
				});
			}
			
		},
	
	
	
		/** When the model ara updated //
		*/
		change: function(model){
			this.model = model;
			var self = this;
			self.render();
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.menus.openresa + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang             : app.lang,
					BookingModel	 : BookingModel,
					recurrenceModel  : self.model
				});
	
	
				$(self.el).html(template);	
				
			});
			$(this.el).hide().fadeIn('slow'); 
			return this;
		},
		
		/** valid all occurences booking
		*/
		updateOccurences: function(e){
			e.preventDefault();
			var self = this;		
			this.openModal(e.currentTarget.id);	
		},
		
		/** unbind occurences : return to list
		*/
		unbindOccurences: function(e){
			e.preventDefault();
			var self = this;				
			delete app.views.bookingsListView.options.recurrence		
			app.router.navigate(app.views.bookingsListView.urlBuilder(), {trigger: true, replace: true});	
		},
		
		openModal: function(state){
			app.views.modalUpdateBookingsListView = new ModalUpdateBookingsListView({
				el      	: '#modalUpdateBookingsList',
				model   	: this.model,
				collection	: this.options.collection,
				state		: state
			});
		},
		
	
	});	
	
	return toolbarButtonsView;

});