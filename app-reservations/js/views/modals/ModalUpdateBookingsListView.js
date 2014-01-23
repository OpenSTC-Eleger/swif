define([
	'app',
	
	'bookingModel',
	
	'genericModalView'

], function(app, BookingModel, GenericModalView){

	'use strict';


	/******************************************
	* Update booking's occurence
	*/
	var modalUpdateBookingsListView = GenericModalView.extend({
	
	
		templateHTML : '/templates/modals/modalUpdateBookingsList.html',
	
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formUpdateBookingList'   : 'updateBooking'
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
			var isClaimer = !app.current_user.isResaManager();
			var noteOptional = !isClaimer && self.options.state == BookingModel.status.cancel.key;
	
			// Retrieve the template // 
			$.get(app.menus.openresa + this.templateHTML, function(templateData){
				var booking = self.options.collection.at(0)
				var template = _.template(templateData, {
					lang     	: app.lang,
					booking  	: booking,
					state		: self.options.state,
					title 	 	: app.lang.resa.viewsTitles[self.options.state + "AllBookings" ],	
					titleNote	: app.lang.resa.viewsTitles[self.options.state + "BookingNote" ],
					BookingModel: BookingModel,
					isClaimer	: isClaimer,
					noteOptional: noteOptional
				});
	
				self.modal.html(template);				
				$('.make-switch').bootstrapSwitch();
				self.modal.modal('show');
			});
	
			return this;
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
				send_invoicing  	: $('#sendInvoicing').bootstrapSwitch('state'),
				send_email			: $('#sendMailToClaimer').bootstrapSwitch('state')
				}
			params[this.options.state+'_note'] = $('#allNote').val();
	
	
			// Save Only the params //
			this.model.save(params, {patch: true, silent: true})
				.done(function(data) {
					self.modal.modal('hide');
					//Fetch recurrence
					self.model.fetch({ data : {fields : self.model.fields} });
					//Fetch booking 's occurences
					_.each(self.options.collection.models, function(model) {
						model.fetch( { data : {fields : model.fields} } )
					});
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