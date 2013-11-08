/******************************************
* Require JS Configuration
*/
require.config({


	paths: {

		// Views //
		requestsListView      : 'app-interventions/js/views/lists/RequestsListView',
		itemRequestView       : 'app-interventions/js/views/items/ItemRequestView',
		modalRequestView      : 'app-interventions/js/views/modals/ModalRequestView',

		// Collections //
		requestsCollection    : 'app-interventions/js/collections/RequestsCollection',

		// Models //
		requestModel          : 'app-interventions/js/models/RequestModel',

		// Router //
		appInterventionsRouter: 'app-interventions/js/routers/AppRouter',

	}

});