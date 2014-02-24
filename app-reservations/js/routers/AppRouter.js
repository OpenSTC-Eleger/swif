/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'moment',

	'bookingsListView',
	'formBookingView',
	'planningManagerView'

], function(app, moment, BookingsListView, FormBookingView, PlanningManagerView){

	'use strict';


	/******************************************
	* Application Router
	*/
	var router = Backbone.Router.extend({



		/** Bookings List
		*/
		bookings: function(recurrence, search, filter, sort, page) {

			var params = this.setContext({recurrence: recurrence, search : search, filter : filter, page : page});

			app.views.bookingsListView = new BookingsListView(params);
		},



		/** Abstent types List
		*/
		formReservation: function(id){

			var params = this.setContext({id: id});

			app.views.formBooking = new FormBookingView(params);
		},



		/** Planning Mananger
		*/
		planningManager: function(calendarView, day, month, year){

			var params = this.setContext({calendarView: calendarView, day: day, month: month, year: year});

			app.views.planningManager = new PlanningManagerView(params);
		}

	});

	return router;

});