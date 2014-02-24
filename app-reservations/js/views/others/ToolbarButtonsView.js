/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'bookingModel',
	'bookingRecurrenceModel',
	
	'modalUpdateBookingsListView'

], function(app, BookingModel, BookingRecurrenceModel, ModalUpdateBookingsListView){

	'use strict';


	/******************************************
	* Booking's Toolbar 
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
				//fetch recurrence model
				this.model = new BookingRecurrenceModel({id: app.views.bookingsListView.options.recurrence });
				this.model.fetch().done(function(model){
					//update toolbar buttons when recurrence change
					self.listenTo(self.model, 'change', self.change);
					_.each(self.options.collection.models, function(model){
						self.listenTo(model, 'change', self.initialize);
					})					
					self.render();
				});
			}
			else{
				if( !_.isUndefined(this.model) && !_.isNull(this.model))
					//Kill listeners on model
					this.model.off();
			}			
		},
	
	
	
		/** When the model ara updated //
		*/
		change: function(model){
			this.model = model;
			
			var self = this;
			//update toolbar buttons when recurrence model change
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
		
		/** valid booking 's occurences
		*/
		updateOccurences: function(e){
			e.preventDefault();
			var self = this;		
			this.openModal(e.currentTarget.id);	
		},
		
		/** unbind occurences : return to bookings list
		*/
		unbindOccurences: function(e){
			e.preventDefault();
			var self = this;				
			delete app.views.bookingsListView.options.recurrence		
			app.router.navigate(app.views.bookingsListView.urlBuilder(), {trigger: true, replace: true});	
		},
		
		/**
		 * Open modal to validate all booking's occurences
		 */
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