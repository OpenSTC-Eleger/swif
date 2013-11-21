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
		requestsList: function(recurrence, search, filter, sort, page) {

			var params = this.setContext({recurrence: recurrence, search : search, filter : filter, page : page});

			app.views.bookingsListView = new BookingsListView(params);
		},


	});

	return router;

});