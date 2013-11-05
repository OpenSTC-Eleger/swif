/******************************************
* Require JS Configuration
*/
require.config({


	paths: {
		
		/* ########### Libs ########### */
		jquery             : 'js/libs/jQuery-2.0.3-min',
		underscore         : 'js/libs/underscore-1.5.2-min',
		backbone           : 'js/libs/backbone-1.1.0',
		
		moment             : 'js/libs/moment-2.3.1',
		'underscore.string': 'js/libs/underscore-string-2.3.2',
		localStorage       : 'js/libs/backbone-localStorage-1.1.7',
		nprogress          : 'js/libs/NProgress-0.1.2',
		pnotify            : 'js/libs/pnotify-1.2.0',
		bootstrap          : 'js/libs/bootstrap-3.0.0',
		bootstrapSwitch    : 'js/libs/bootstrap-switch-1.8.0',
		select2            : 'js/libs/select2-3.4.2-min',
		less               : 'js/libs/less-1.5.0-min',

		app                : 'js/app',
		main               : 'js/main',
		context            : 'js/context',


		/* ###########       App        ########### */

		// Helpers //
		appHelpers		          : 'js/helpers/main',

		// Router //
		appRouter		          : 'js/routers/AppRouter',

		// Collections //
		genericCollection          : 'js/collections/GenericCollection',
		usersCollection            : 'js/collections/UsersCollection',
		claimersCollection         : 'js/collections/ClaimersCollection',
		claimersContactsCollection : 'js/collections/ClaimersContactsCollection',
		equipmentsCollection       : 'js/collections/EquipmentsCollection',
		placesCollection           : 'js/collections/PlacesCollection',
		claimersServicesCollection : 'js/collections/ClaimersServicesCollection',

		// Models /
		genericModel            : 'js/models/GenericModel',
		userModel               : 'js/models/UserModel',
		claimerModel            : 'js/models/ClaimerModel',
		claimerContactModel     : 'js/models/ClaimerContactModel',
		equipmentModel          : 'js/models/EquipmentModel',
		placeModel              : 'js/models/PlaceModel',
		claimerServiceModel    : 'js/models/ClaimerServiceModel',

		// Views //
		headerView              : 'js/views/HeaderView',
		footerView              : 'js/views/FooterView',
		loginView               : 'js/views/LoginView',
		notFoundView            : 'js/views/NotFoundView',
		dashboardView           : 'js/views/DashboardView',
		dashboardView           : 'js/views/DashboardView',
		genericListView         : 'js/views/GenericListView',
		genericModalView        : 'js/views/modals/GenericModalView',
		paginationView          : 'js/views/PaginationView',
		advancedSelectBoxView   : 'js/views/AdvancedSelectBoxView',

		


		/* ########### App-Interventions ########### */
		
		// Views //
		requestsListView    : 'app-interventions/js/views/lists/RequestsListView',
		itemRequestView     : 'app-interventions/js/views/items/ItemRequestView',
		modalRequestView    : 'app-interventions/js/views/modals/ModalRequestView',

		// Collections //
		requestsCollection  : 'app-interventions/js/collections/RequestsCollection',

		// Models //
		requestModel        : 'app-interventions/js/models/RequestModel',

	},

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
		'bootstrapSwitch': {
			deps   : ['jquery'],
			exports: 'bootstrapSwitch'	
		},
		'select2': {
			deps   : ['jquery'],
			exports: 'select2'
		}
	},

 	packages: [{ 
		name    : 'app-interventions',
		location: 'app-interventions',
		main    : 'main'
    }]

});



/******************************************
* Start The App
*/
require([
	'main', 'less'
], function(main){

	main.init('fr');

});