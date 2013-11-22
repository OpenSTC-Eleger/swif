define([
	'app',
	'appRouter',

	'bookingsListView',

], function(app, AppRouter, BookingsListView){

	'use strict';


	/******************************************
	* Application Router
	*/
	var router = AppRouter.extend({


		/** Bookings List
		*/
		bookings: function(recurrence, search, filter, sort, page) {

			var params = this.setContext({recurrence: recurrence, search : search, filter : filter, page : page});

			app.views.bookingsListView = new BookingsListView(params);
		},
		
		formReservation: function(id){
			params = {}
			if (!_.isUndefined(id)){
				params.booking_id = id;
			}
			app.views.formBooking = new app.Views.FormBooking(params);
		}

	});

	return router;

});