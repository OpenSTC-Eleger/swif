/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		/* #############
		* Libs
		*/
		jquery                : 'js/libs/jQuery-2.0.3-min',
		printElement          : 'js/libs/jquery.printElement-2.0.0',
		underscore            : 'js/libs/underscore-1.5.2-min',
		backbone              : 'js/libs/backbone-1.1.0',
		
		jqueryui              : 'js/libs/jquery-ui-1.10.3.custom.min',
		datatables	  		  :	'js/libs/jquery-dataTables-1.9.4-min',
		moment                : 'js/libs/moment-2.5.0-min',
		'moment-timezone'     : 'js/libs/moment-timezone-0.0.1',
		'moment-timezone-data': 'js/i18n/moment-timezone-data',

		'underscore.string'   : 'js/libs/underscore-string-2.3.2',
		nprogress             : 'js/libs/NProgress-0.1.2',
		pnotify               : 'js/libs/pnotify-1.2.0',
		bootstrap             : 'js/libs/bootstrap-3.0.2',
		bsDatepicker          : 'js/libs/bootstrap-datepicker-1.1.1',
		bsSwitch              : 'js/libs/bootstrap-switch-2.0.0',
		bsTimepicker          : 'js/libs/bootstrap-timepicker-0.2.3',
		fullcalendar          : 'js/libs/fullcalendar-1.6.4',
		select2               : 'js/libs/select2-3.4.5-min',

		less                  : 'js/libs/less-1.5.0',


		/* #############
		* i18n Libs
		*/
		'select2-lang'         : 'js/i18n/select2-lang',
		'bsDatepicker-lang'    : 'js/i18n/bootstrap-datepicker-lang',


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
		teamsCollection            : 'js/collections/TeamsCollection',
		officersCollection         : 'js/collections/OfficersCollection',


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
		equipmentTypeModel      : 'js/models/EquipmentTypeModel',
		placeModel              : 'js/models/PlaceModel',
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
		aboutView               : 'js/views/others/AboutView',
		advancedSelectBoxView   : 'js/views/others/AdvancedSelectBoxView',
		teamMembersAndServices  : 'js/views/others/TeamMembersAndServices',

		// Lists //
		genericListView         : 'js/views/lists/GenericListView',
		placesListView          : 'js/views/lists/PlacesListView',
		claimersListView        : 'js/views/lists/ClaimersListView',
		claimerContactsListView : 'js/views/lists/ClaimerContactsListView',
		servicesListView        : 'js/views/lists/ServicesListView',
		officersListView        : 'js/views/lists/OfficersListView',
		teamsListView           : 'js/views/lists/TeamsListView',
		claimersTypesListView   : 'js/views/lists/ClaimersTypesListView',
		equipmentsListView      : 'js/views/lists/EquipmentsListView',
		usersListView           : 'js/views/lists/UsersListView',

		// Items //		
		itemPlaceView           : 'js/views/items/ItemPlaceView',
		claimerView             : 'js/views/items/ClaimerView',
		itemTeamView            : 'js/views/items/ItemTeamView',
		itemServiceView         : 'js/views/items/ItemServiceView',
		itemOfficerView         : 'js/views/items/ItemOfficerView',
		claimerContactView      : 'js/views/items/ClaimerContactView',
		itemEquipmentView       : 'js/views/items/ItemEquipmentView',
		itemClaimerTypeView     : 'js/views/items/ItemClaimerTypeView',
		itemUserView            : 'js/views/items/ItemUserView',

		// Modals //
		genericModalView        : 'js/views/modals/GenericModalView',
		modalPlaceView          : 'js/views/modals/ModalPlaceView',
		modalClaimerEdit        : 'js/views/modals/ModalClaimerEdit',
		modalTeamView           : 'js/views/modals/ModalTeamView',
		modalDeleteView         : 'js/views/modals/ModalDeleteView',
		modalServiceView        : 'js/views/modals/ModalServiceView',
		modalOfficerView        : 'js/views/modals/ModalOfficerView',
        modalContactEdit        : 'js/views/modals/ModalContactEdit',
		modalEquipmentView      : 'js/views/modals/ModalEquipmentView',
		modalClaimerTypeView    : 'js/views/modals/ModalClaimerTypeView',
		modalResetPasswordView  : 'js/views/modals/ModalResetPasswordView'

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
			deps   : ['jqueryui', 'underscore', 'underscore.string'],
			exports: 'Backbone',
			init : function(JQuery, _, UnderscoreString){
				_.str = UnderscoreString;
				_.mixin(_.str.exports());
			}
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
		'select2-lang': {
			deps   : ['jquery', 'select2'],
			exports: 'select2'
		},
		'fullcalendar': {
			deps   : ['jquery']
		},
		'bsDatepicker-lang': {
			deps   : ['jquery', 'bsDatepicker'],
			exports: 'datepicker'
		},
		'bsTimepicker': {
			deps   : ['jquery']
		},
		'printElement': {
			deps   : ['jqueryui'],
			exports: 'printElement'
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