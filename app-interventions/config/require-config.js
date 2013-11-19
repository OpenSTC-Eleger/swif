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
		modalValidRequestView       : 'app-interventions/js/views/modals/ModalValidRequestView',
		modalRefuseRequestView      : 'app-interventions/js/views/modals/ModalRefuseRequestView',
		itemCategoryRequestView     : 'app-interventions/js/views/items/ItemCategoryRequestView',
		categoriesRequestsListView  : 'app-interventions/js/views/lists/CategoriesRequestsListView',
		modalCategoryRequestView    : 'app-interventions/js/views/modals/ModalCategoryRequestView',
		modalConfirmRequestView     : 'app-interventions/js/views/modals/ModalConfirmRequestView',
		
		categoriesTasksListView  	: 'app-interventions/js/views/lists/CategoriesTasksListView',
		itemCategoryTaskView     	: 'app-interventions/js/views/items/ItemCategoryTaskView',
		modalCategoryTaskView    	: 'app-interventions/js/views/modals/ModalCategoryTaskView',
		
		absentTypesListView  		: 'app-interventions/js/views/lists/AbsentTypesListView',
		itemAbsentTypeView	     	: 'app-interventions/js/views/items/ItemAbsentTypeView',
		modalAbsentTypeView    		: 'app-interventions/js/views/modals/ModalAbsentTypeView',

		interventionsListView       : 'app-interventions/js/views/lists/InterventionsListView',
		itemInterventionView        : 'app-interventions/js/views/items/ItemInterventionView',
		itemInterventionTaskListView: 'app-interventions/js/views/items/ItemInterventionTaskListView',
		itemInterventionTaskView    : 'app-interventions/js/views/items/ItemInterventionTaskView',
		modalInterventionView       : 'app-interventions/js/views/modals/interventions/ModalInterventionView',
		modalCancelInterventionView : 'app-interventions/js/views/modals/interventions/ModalCancelInterventionView',
	}

});