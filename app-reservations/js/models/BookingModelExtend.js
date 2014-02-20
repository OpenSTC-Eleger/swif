define([
	'app',
	
	'bookingModel',
	'bookingRecurrenceModel',


], function(app, BookingModel, BookingRecurrenceModel){

	'use strict';
	
	/******************************************
	* Booking Model Extend to avoid inter-dependance between BookingModel and BookingRecurrenceModel
	*/
	var booking = BookingModel.extend({
		
/**
		 * Fetch Booking and all of its linked models, such as BookingLines or BookingRecurrence.
		 * Set this.lines and this.recurrence attributes with their respecting *Model
		 */
		fetchFromBackend: function(){
			var self = this;
			var deferred = $.Deferred();
			this.fetch({silent: true}).done(function(){
				var waitDeferred = [];
				//fetch and render lines
				waitDeferred.push(self.fetchLines());
				
				//fetch and render recurrence if exists
				if(self.getRecurrence() != false){
					var recurrence = new BookingRecurrenceModel({id:self.getRecurrence('id')});
					waitDeferred.push(recurrence.fetch());
					recurrence.setTemplate(self);
				}
				$.when.apply($, waitDeferred).done(function(){
					deferred.resolve();
				}).fail(function(e){
					deferred.reject();
				});
			});
			return deferred;
		},
	});
	return booking;
});