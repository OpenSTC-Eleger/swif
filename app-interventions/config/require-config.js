/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		// Router //
		appInterventionsRouter      : 'app-interventions/js/routers/AppRouter',

		// Collections //
		requestsCollection          : 'app-interventions/js/collections/RequestsCollection',
		tasksCollection             : 'app-interventions/js/collections/TasksCollection',
		categoriesRequestsCollection: 'app-interventions/js/collections/CategoriesRequestsCollection',
		categoriesTasksCollection   : 'app-interventions/js/collections/CategoriesTasksCollection',
		absentTypesCollection       : 'app-interventions/js/collections/AbsentTypesCollection',
		interventionsCollection     : 'app-interventions/js/collections/InterventionsCollection',

		// Models //
		requestModel                : 'app-interventions/js/models/RequestModel',
		taskModel                   : 'app-interventions/js/models/TaskModel',
		categoryRequestModel        : 'app-interventions/js/models/CategoryRequestModel',
		categoryTaskModel           : 'app-interventions/js/models/CategoryTaskModel',
		absentTypeModel             : 'app-interventions/js/models/AbsentTypeModel',
		interventionModel           : 'app-interventions/js/models/InterventionModel',

		// Views //
		requestsListView            : 'app-interventions/js/views/lists/RequestsListView',
		itemRequestView             : 'app-interventions/js/views/items/ItemRequestView',
		modalRequestView            : 'app-interventions/js/views/modals/ModalRequestView',

	}

});