define([
	'app',
	'appRouter',

	'bookingsListView',
	'formBookingView',

], function(app, AppRouter, BookingsListView, FormBookingView){

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
			var params = this.setContext({id:id});

			app.views.formBooking = new FormBookingView(params);
		}

	});

	return router;

});