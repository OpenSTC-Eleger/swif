/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		/* #############
		* Libs
		*/
		jquery                : 'js/libs/jQuery-2.0.3-min',
		underscore            : 'js/libs/underscore-1.5.2-min',
		backbone              : 'js/libs/backbone-1.1.0',

		jqueryui              : 'js/libs/jquery-ui-1.10.3.custom.min',
		moment                : 'js/libs/moment-2.4.0',
		'moment-timezone'     : 'js/libs/moment-timezone-0.0.1',
		'moment-timezone-data': 'i18n/moment-timezone-data',

		'underscore.string'   : 'js/libs/underscore-string-2.3.2',
		localStorage          : 'js/libs/backbone-localStorage-1.1.7',
		nprogress             : 'js/libs/NProgress-0.1.2',
		pnotify               : 'js/libs/pnotify-1.2.0',
		bootstrap             : 'js/libs/bootstrap-3.0.2',
		bsDatepicker          : 'js/libs/bootstrap-datepicker-1.1.1',
		bsSwitch              : 'js/libs/bootstrap-switch-1.8.0',
		bsTimepicker          : 'js/libs/bootstrap-timepicker-0.2.3',
		fullcalendar          : 'js/libs/fullcalendar-1.6.4',
		select2               : 'js/libs/select2-3.4.2-min',

		less                  : 'js/libs/less-1.5.0',


		/* #############
		* i18n Libs
		*/
		'select2-lang'         : 'i18n/select2-lang',
		'bsDatepicker-lang'    : 'i18n/bootstrap-datepicker-lang',


		app                   : 'js/app',
		main                  : 'js/main',


		/* #############
		* Helpers
		*/
		appHelpers		          : 'js/helpers/main',

		/* #############
		* Routers
		*/
		appRouter		          : 'js/routers/AppRouter',

		/* #############
		* Collections
		*/
		genericCollection          : 'js/collections/GenericCollection',
		usersCollection            : 'js/collections/UsersCollection',
		claimersCollection         : 'js/collections/ClaimersCollection',
		claimersContactsCollection : 'js/collections/ClaimersContactsCollection',
		claimersServicesCollection : 'js/collections/ClaimersServicesCollection',
		claimersTypesCollection    : 'js/collections/ClaimersTypesCollection',
		equipmentsCollection       : 'js/collections/EquipmentsCollection',
		equipmentsTypesCollection  : 'js/collections/EquipmentsTypesCollection',
		placesCollection           : 'js/collections/PlacesCollection',
		placeTypesCollection       : 'js/collections/PlaceTypesCollection',
		stcGroupsCollection        : 'js/collections/STCGroupsCollection',
		teamsCollection            : 'js/models/TeamsCollection',
		officersCollection         : 'js/models/OfficersCollection',

		/* #############
		* Models
		*/
		genericModel            : 'js/models/GenericModel',
		userModel               : 'js/models/UserModel',
		claimerModel            : 'js/models/ClaimerModel',
		claimerTypeModel        : 'js/models/ClaimerTypeModel',
		claimerContactModel     : 'js/models/ClaimerContactModel',
		claimerServiceModel     : 'js/models/ClaimerServiceModel',
		equipmentModel          : 'js/models/EquipmentModel',
		placeModel              : 'js/models/PlaceModel',
		claimerServiceModel     : 'js/models/ClaimerServiceModel',
		teamModel               : 'js/models/TeamModel',
		officerModel            : 'js/models/OfficerModel',

		/* #############
		* Views
		*/
		headerView              : 'js/views/others/HeaderView',
		footerView              : 'js/views/others/FooterView',
		loginView               : 'js/views/others/LoginView',
		paginationView          : 'js/views/others/PaginationView',
		notFoundView            : 'js/views/others/NotFoundView',
		advancedSelectBoxView   : 'js/views/others/AdvancedSelectBoxView',
		dashboardView           : 'js/views/others/DashboardView',
		dashboardView           : 'js/views/others/DashboardView',
		genericListView         : 'js/views/lists/GenericListView',
		genericModalView        : 'js/views/modals/GenericModalView'
	},

	packages: [
		{
			name    : 'app-interventions',
			location: 'app-interventions',
			main    : 'main'
		},
		{
			name    : 'app-reservations',
			location: 'app-reservations',
			main    : 'main'
		}
	],

	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps   : ['jquery', 'underscore', 'underscore.string'],
			exports: 'Backbone',
			init : function(JQuery, _, UnderscoreString){
				_.mixin(UnderscoreString);
			}
		},
		'localStorage': {
			deps   : ['backbone'],
			exports: 'Backbone'
		},
		'nprogress': {
			deps   : ['jquery'],
			exports: 'NProgress'
		},
		'pnotify': {
			deps   : ['jquery'],
			exports: 'pnotify'
		},
		'bootstrap': {
			deps   : ['jquery'],
			exports: 'bootstrap'
		},
		'jqueryui': {
			deps   : ['jquery'],
			exports: 'jquery'
		},
		'bsSwitch': {
			deps   : ['jquery'],
			exports: 'bsSwitch'	
		},
		'select2': {
			deps   : ['jquery'],
			exports: 'select2'
		},
		'select2-lang': {
			deps   : ['select2'],
			exports: 'select2'
		},
		'fullcalendar': {
			deps   : ['jquery']
		},
		'bsDatepicker': {
			deps   : ['jquery']
		},
		'bsDatepicker-lang': {
			deps   : ['bsDatepicker'],
			exports: 'bsDatepicker'
		},
		'bsTimepicker': {
			deps   : ['jquery']
		},

		'app-interventions' : {
			deps   : ['app-interventions/config/require-config']
		},
		'app-reservations' : {
			deps   : ['app-reservations/config/require-config']
		}
	}

});



/******************************************
* Start The App
*/
require([
	'main', 'less'
], function(main){

	main.init(window.navigator.language);

});