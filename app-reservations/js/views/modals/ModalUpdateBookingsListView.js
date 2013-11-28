define([
	'app',
	
	'bookingModel',
	
	'genericModalView'

], function(app, BookingModel, GenericModalView){

	'use strict';


	/******************************************
	* Refuse Request Modal View
	*/
	var modalUpdateBookingsListView = GenericModalView.extend({
	
	
		templateHTML : '/templates/modals/modalUpdateBookingsList.html',
	
	
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
					lang     	: app.lang,
					booking  	: self.options.booking,
					state		: self.options.state,
					title 	 	: app.lang.resa.viewsTitles[self.options.state + "AllBookings" ],
					iconTitle	: self.getIconTitle(),
					BookingModel: BookingModel
				});
	
				self.modal.html(template);				
								
				if( self.options.state == BookingModel.status.done.key) {
					$('#note').html(self.options.booking.getResourceNames('newline'));
				}		
	
				self.modal.modal('show');
			});
	
			return this;
		},
		
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
	
		/** Delete the model pass in the view
		*/
		updateBooking: function(e){
			e.preventDefault();
	
			var self = this;
	
			// Set the button in loading State //
			$(this.el).find("button[type=submit]").button('loading');
	
			var params = {
				state   : this.options.state,			 
				note 	: $('#note').val()
			}
	
	
			// Save Only the params //
			this.model.save(params, {patch: true, silent: true})
				.done(function(data) {
					self.modal.modal('hide');
					//self.model.fetch({ data : {fields : self.model.fields} });
				})
				.fail(function (e) {
					console.log(e);
				})
				.always(function () {
					$(self.el).find("button[type=submit]").button('reset');
				});
			
		}
	
	});
	
	return modalUpdateBookingsListView;
})