/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		// Router //
		appReservationsRouter      			: 'app-reservations/js/routers/AppRouter',

		// Collections //
		bookingsCollection        			: 'app-reservations/js/collections/BookingsCollection',
		bookingLinesCollection          	: 'app-reservations/js/collections/BookingLinesCollection',
		bookingRecurrencesCollection        : 'app-reservations/js/collections/BookingRecurencesCollection',
		

		// Models //
		bookingModel                		: 'app-reservations/js/models/BookingModel',
		bookingLineModel                	: 'app-reservations/js/models/BookingLineModel',
		bookingRecurrenceModel             	: 'app-reservations/js/models/BookingRecurrenceModel',

		// Views //
		bookingsListView            		: 'app-reservations/js/views/lists/BookingsListView',
		
		// Items //
		itemBookingView            			: 'app-reservations/js/views/items/ItemBookingView',
		itemBookingOccurrencesListView      : 'app-reservations/js/views/items/ItemBookingOccurrencesListView',
		itemBookingOccurrenceView           : 'app-reservations/js/views/items/ItemBookingOccurrenceView',
		
		// Modals //
		modalValidBookingView          		: 'app-reservations/js/views/modals/ModalValidBookingView',
		modalValidBookingsListView          : 'app-reservations/js/views/modals/ModalValidBookingsListView',		
		
	}

});