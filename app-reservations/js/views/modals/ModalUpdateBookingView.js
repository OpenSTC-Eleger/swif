define([
	'app',	
	
	'bookingModel',
	
	'genericModalView',
	

], function(app, BookingModel, GenericModalView){

	'use strict';

	/******************************************
	* Update booking
	*/
	var modalUpdateBookingView = GenericModalView.extend({
	
	
		templateHTML : '/templates/modals/modalUpdateBooking.html',
	
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formUpdateBooking'   : 'updateBooking'
			}, 
				GenericModalView.prototype.events
			);
		},	
	
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
			var self = this;
	
			this.modal = $(this.el);
	
			this.render();
		},	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.menus.openresa + this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang    	: app.lang,
					booking 	: self.model,
					state		: self.options.state,
					title 	 	: app.lang.resa.viewsTitles[self.options.state + "Booking" ],
					iconTitle	: self.getIconTitle(),
					BookingModel: BookingModel
				});
				
				self.modal.html(template);
	
				self.modal.modal('show');
			});
	
			return this;
		},
	
		 /**
		 * Adapts icon displayed on top with state wanted
		 */
		getIconTitle: function(){
			switch (this.options.state){ 
				case BookingModel.status.done.key: 
					return 'fa-eye-slash';
				break;
				case BookingModel.status.cancel.key:
					return 'fa-times';
				break;
				default: 
					return 'fa-check';
			}
		},
	
		/** Update the model pass in the view
		*/
		updateBooking: function(e){
			e.preventDefault();
	
			var self = this;
	
			// Set the button in loading State //
			$(this.el).find("button[type=submit]").button('loading');
	
	
			var params = {
				state_event   		: this.options.state,
				send_invoicing  	: $('#sendInvoicing').is(':checked'),
			}
			params[this.options.state+'_note'] = $('#note').val()
	
			// Save Only the params //
			this.model.save(params, {patch: true, silent: true})
				.done(function(data) {
					self.modal.modal('hide');
					//Fetch booking
					self.model.fetch({ data : {fields : self.model.fields} });
				})
				.fail(function (e) {
					console.log(e);
				})
				.always(function () {
					$(self.el).find("button[type=submit]").button('reset');
				});
		}
	
	});	
		
	return modalUpdateBookingView;
})