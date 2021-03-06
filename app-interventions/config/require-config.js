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
		appInterventionsRouter      	: '../app-interventions/js/routers/AppRouter',

		// Collections //
		requestsCollection          	: '../app-interventions/js/collections/RequestsCollection',
		tasksCollection             	: '../app-interventions/js/collections/TasksCollection',
		categoriesRequestsCollection	: '../app-interventions/js/collections/CategoriesRequestsCollection',
		categoriesTasksCollection   	: '../app-interventions/js/collections/CategoriesTasksCollection',
		absentTypesCollection       	: '../app-interventions/js/collections/AbsentTypesCollection',
		interventionsCollection     	: '../app-interventions/js/collections/InterventionsCollection',

		// Models //
		requestModel                	: '../app-interventions/js/models/RequestModel',
		taskModel                   	: '../app-interventions/js/models/TaskModel',
		taskRecurrenceModel             : '../app-interventions/js/models/TaskRecurrenceModel',
		taskSchedulesModel          	: '../app-interventions/js/models/TaskSchedulesModel',
		categoryRequestModel        	: '../app-interventions/js/models/CategoryRequestModel',
		categoryTaskModel           	: '../app-interventions/js/models/CategoryTaskModel',
		absentTypeModel             	: '../app-interventions/js/models/AbsentTypeModel',
		interventionModel           	: '../app-interventions/js/models/InterventionModel',

		// Views //
		requestsListView            	: '../app-interventions/js/views/lists/RequestsListView',
		itemRequestView             	: '../app-interventions/js/views/items/ItemRequestView',
		modalRequestView            	: '../app-interventions/js/views/modals/ModalRequestView',
		modalValidRequestView       	: '../app-interventions/js/views/modals/ModalValidRequestView',
		modalRefuseRequestView      	: '../app-interventions/js/views/modals/ModalRefuseRequestView',
		itemCategoryRequestView     	: '../app-interventions/js/views/items/ItemCategoryRequestView',
		categoriesRequestsListView  	: '../app-interventions/js/views/lists/CategoriesRequestsListView',
		modalCategoryRequestView    	: '../app-interventions/js/views/modals/ModalCategoryRequestView',
		modalConfirmRequestView     	: '../app-interventions/js/views/modals/ModalConfirmRequestView',

		categoriesTasksListView  		: '../app-interventions/js/views/lists/CategoriesTasksListView',
		itemCategoryTaskView     		: '../app-interventions/js/views/items/ItemCategoryTaskView',
		modalCategoryTaskView    		: '../app-interventions/js/views/modals/ModalCategoryTaskView',

		absentTypesListView  		    : '../app-interventions/js/views/lists/AbsentTypesListView',
		itemAbsentTypeView	     	    : '../app-interventions/js/views/items/ItemAbsentTypeView',
		modalAbsentTypeView    		    : '../app-interventions/js/views/modals/ModalAbsentTypeView',

		planningView  					: '../app-interventions/js/views/others/PlanningView',
		calendarView  					: '../app-interventions/js/views/others/CalendarView',
		printingCalendarView  			: '../app-interventions/js/views/others/PrintingCalendarView',
		planningInterListView  			: '../app-interventions/js/views/lists/PlanningInterListView',
		itemPlanningInterView     		: '../app-interventions/js/views/items/ItemPlanningInterView',
		itemPlanningInterTaskListView	: '../app-interventions/js/views/items/ItemPlanningInterTaskListView',
		itemPlanningInterTaskView		: '../app-interventions/js/views/items/ItemPlanningInterTaskView',
		modalAbsentTaskView    			: '../app-interventions/js/views/modals/tasks/ModalAbsentTaskView',
		modalUnplanTaskView    			: '../app-interventions/js/views/modals/tasks/ModalUnplanTaskView',

		interventionsListView           : '../app-interventions/js/views/lists/InterventionsListView',
		itemInterventionView            : '../app-interventions/js/views/items/ItemInterventionView',
		itemInterventionTaskListView    : '../app-interventions/js/views/items/ItemInterventionTaskListView',
		itemInterventionTaskView        : '../app-interventions/js/views/items/ItemInterventionTaskView',
		modalInterventionView           : '../app-interventions/js/views/modals/interventions/ModalInterventionView',
		modalCancelInterventionView     : '../app-interventions/js/views/modals/interventions/ModalCancelInterventionView',
		modalInterventionAddTaskView    : '../app-interventions/js/views/modals/interventions/ModalInterventionAddTaskView',
		modalCancelTaskView             : '../app-interventions/js/views/modals/interventions/ModalCancelTaskView',
		modalTaskDoneView               : '../app-interventions/js/views/modals/interventions/ModalTaskDoneView',
		modalRecurrenceTaskView			: '../app-interventions/js/views/modals/interventions/ModalRecurrenceTaskView',
		modalRecurrenceTaskItemView		: '../app-interventions/js/views/modals/interventions/ModalRecurrenceTaskItemView',
		modalDetailCostTaskView         : '../app-interventions/js/views/modals/tasks/ModalDetailCostTaskView',
		modalDetailCostInterView        : '../app-interventions/js/views/modals/interventions/ModalDetailCostInterView',

		tasksListView                   : '../app-interventions/js/views/lists/TasksListView',
		itemTaskDayListView             : '../app-interventions/js/views/items/ItemTaskDayListView',
		itemTaskDayView                 : '../app-interventions/js/views/items/ItemTaskDayView',
		modalAddTaskView                : '../app-interventions/js/views/modals/tasks/ModalAddTaskView',
		modalTaskDayDoneView            : '../app-interventions/js/views/modals/tasks/ModalTaskDayDoneView',
		multiSelectBoxUsersView         : '../app-interventions/js/views/others/MultiSelectBoxUsersView'
	}

});