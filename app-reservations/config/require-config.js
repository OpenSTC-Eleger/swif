/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		// Router //
		appReservationsRouter               : '../app-reservations/js/routers/AppRouter',

		// Collections //
		bookingsCollection        			: '../app-reservations/js/collections/BookingsCollection',
		bookingLinesCollection          	: '../app-reservations/js/collections/BookingLinesCollection',
		bookingRecurrencesCollection        : '../app-reservations/js/collections/BookingRecurencesCollection',
		bookablesCollection	                : '../app-reservations/js/collections/BookablesCollection',
		bookablesPartnerCollection          : '../app-reservations/js/collections/BookablesPartnerCollection',

		// Models //
		bookingModel                        : '../app-reservations/js/models/BookingModel',
		bookingLineModel                    : '../app-reservations/js/models/BookingLineModel',
		bookingRecurrenceModel             	: '../app-reservations/js/models/BookingRecurrenceModel',
		bookableModel		             	: '../app-reservations/js/models/BookableModel',



		// Views Lists //
		bookingsListView                    : '../app-reservations/js/views/lists/BookingsListView',
		formBookingView				        : '../app-reservations/js/views/forms/FormBookingView',
		itemFormBookingLineView				: '../app-reservations/js/views/forms/ItemFormBookingLineView',
		formRecurrenceView					: '../app-reservations/js/views/forms/FormRecurrenceView',
		itemFormBookingOccurrenceView		: '../app-reservations/js/views/forms/ItemFormBookingOccurrenceView',
		planningManagerView  				: '../app-reservations/js/views/others/PlanningManagerView',


		// Views Others //
		planningManagerView                 : '../app-reservations/js/views/others/PlanningManagerView',
		sideBarPlanningSelectResourcesView  : '../app-reservations/js/views/others/SideBarPlanningSelectResourcesView',
		calendarPlanningView                : '../app-reservations/js/views/others/CalendarPlanningView',


		// Views Items //
		itemBookingView                     : '../app-reservations/js/views/items/ItemBookingView',

		// Views Modals //
		modalUpdateBookingView              : '../app-reservations/js/views/modals/ModalUpdateBookingView',
		modalUpdateBookingsListView         : '../app-reservations/js/views/modals/ModalUpdateBookingsListView',
		modalReservationDetailsView         : '../app-reservations/js/views/modals/ModalReservationDetailsView',
		modalDeleteBookingView				: '../app-reservations/js/views/modals/ModalDeleteBookingView',

		//Others View //
		toolbarButtonsView                  : '../app-reservations/js/views/others/ToolbarButtonsView',

	}

});