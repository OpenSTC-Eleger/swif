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

		/* #############
		* Libs
		*/
		jquery                : 'libs/jQuery-2.1.0-min',
		printElement          : 'libs/jquery.printElement-2.0.0',
		underscore            : 'libs/underscore-1.6.0-min',
		backbone              : 'libs/backbone-1.1.1-min',

		jqueryui              : 'libs/jquery-ui-1.10.3.custom.min',
		datatables            : 'libs/jquery-dataTables-1.9.4-min',
		moment                : 'libs/moment-2.5.0-min',
		'moment-timezone'     : 'libs/moment-timezone-0.0.1-min',
		'moment-timezone-data': 'i18n/moment-timezone-data',

		'underscore.string'   : 'libs/underscore-string-2.3.2-min',
		nprogress             : 'libs/NProgress-0.1.2',
		pnotify               : 'libs/pnotify-1.2.2',
		bootstrap             : 'libs/bootstrap-3.1.1-min',
		bsDatepicker          : 'libs/bootstrap-datepicker-1.1.2',
		bsSwitch              : 'libs/bootstrap-switch-2.0.0',
		bsTimepicker          : 'libs/bootstrap-timepicker-0.2.3',
		fullcalendar          : 'libs/fullcalendar-1.6.4-min',
		select2               : 'libs/select2-3.4.5-min',

		less                  : 'libs/less-1.6.3-min',


		/* #############
		* i18n Libs
		*/
		'select2-lang'         : 'i18n/select2-lang',
		'bsDatepicker-lang'    : 'i18n/bootstrap-datepicker-lang',


		app                   : 'app',
		main                  : 'main',


		/* #############
		* Helpers
		*/
		appHelpers                : 'helpers/main',


		/* #############
		* Routers
		*/
		appRouter                 : 'routers/AppRouter',


		/* #############
		* Collections
		*/
		genericCollection          : 'collections/GenericCollection',
		usersCollection            : 'collections/UsersCollection',
		claimersCollection         : 'collections/ClaimersCollection',
		claimersContactsCollection : 'collections/ClaimersContactsCollection',
		claimersServicesCollection : 'collections/ClaimersServicesCollection',
		claimersTypesCollection    : 'collections/ClaimersTypesCollection',
		equipmentsCollection       : 'collections/EquipmentsCollection',
		equipmentsTypesCollection  : 'collections/EquipmentsTypesCollection',
		placesCollection           : 'collections/PlacesCollection',
		placeTypesCollection       : 'collections/PlaceTypesCollection',
		stcGroupsCollection        : 'collections/STCGroupsCollection',
		teamsCollection            : 'collections/TeamsCollection',
		officersCollection         : 'collections/OfficersCollection',
		metaDatasCollection        : 'collections/MetaDatasCollection',
		filtersCollection          : 'collections/FiltersCollection',


		/* #############
		* Models
		*/
		genericModel            : 'models/GenericModel',
		userModel               : 'models/UserModel',
		claimerModel            : 'models/ClaimerModel',
		claimerTypeModel        : 'models/ClaimerTypeModel',
		claimerContactModel     : 'models/ClaimerContactModel',
		claimerServiceModel     : 'models/ClaimerServiceModel',
		equipmentModel          : 'models/EquipmentModel',
		equipmentTypeModel      : 'models/EquipmentTypeModel',
		placeModel              : 'models/PlaceModel',
		teamModel               : 'models/TeamModel',
		officerModel            : 'models/OfficerModel',
		metaDataModel           : 'models/MetaDataModel',
		filterModel             : 'models/FilterModel',


		/* #############
		* Views
		*/
		headerView                  : 'views/others/HeaderView',
		footerView                  : 'views/others/FooterView',
		loginView                   : 'views/others/LoginView',
		paginationView              : 'views/others/PaginationView',
		notFoundView                : 'views/others/NotFoundView',
		aboutView                   : 'views/others/AboutView',
		teamMembersAndServices      : 'views/others/TeamMembersAndServices',
		advanceSearchView           : 'views/others/AdvanceSearchView',
		fieldContainerView          : 'views/others/FieldContainerView',
		recordFilterView            : 'views/others/RecordFilterView',

		// Lists //
		genericListView         : 'views/lists/GenericListView',
		placesListView          : 'views/lists/PlacesListView',
		claimersListView        : 'views/lists/ClaimersListView',
		claimerContactsListView : 'views/lists/ClaimerContactsListView',
		servicesListView        : 'views/lists/ServicesListView',
		officersListView        : 'views/lists/OfficersListView',
		teamsListView           : 'views/lists/TeamsListView',
		claimersTypesListView   : 'views/lists/ClaimersTypesListView',
		equipmentsListView      : 'views/lists/EquipmentsListView',
		usersListView           : 'views/lists/UsersListView',

		// Items //
		itemPlaceView           : 'views/items/ItemPlaceView',
		claimerView             : 'views/items/ClaimerView',
		itemTeamView            : 'views/items/ItemTeamView',
		itemServiceView         : 'views/items/ItemServiceView',
		itemOfficerView         : 'views/items/ItemOfficerView',
		claimerContactView      : 'views/items/ClaimerContactView',
		itemEquipmentView       : 'views/items/ItemEquipmentView',
		itemClaimerTypeView     : 'views/items/ItemClaimerTypeView',
		itemUserView            : 'views/items/ItemUserView',

		// Modals //
		genericModalView        : 'views/modals/GenericModalView',
		modalPlaceView          : 'views/modals/ModalPlaceView',
		modalClaimerEdit        : 'views/modals/ModalClaimerEdit',
		modalTeamView           : 'views/modals/ModalTeamView',
		modalDeleteView         : 'views/modals/ModalDeleteView',
		modalServiceView        : 'views/modals/ModalServiceView',
		modalOfficerView        : 'views/modals/ModalOfficerView',
		modalContactEdit        : 'views/modals/ModalContactEdit',
		modalEquipmentView      : 'views/modals/ModalEquipmentView',
		modalClaimerTypeView    : 'views/modals/ModalClaimerTypeView',
		modalResetPasswordView  : 'views/modals/ModalResetPasswordView',
		modalSaveFilterView     : 'views/modals/ModalSaveFilterView',

		// Form Components //
		advancedSelectBoxView   : 'views/form-components/AdvancedSelectBoxView',
		inputFieldView          : 'views/form-components/InputFieldView',
		dateFieldView           : 'views/form-components/DateFieldView',
		numberFieldView         : 'views/form-components/NumberFieldView',
			
		// Tab componnents //
		tabsContainerView     	: 'views/tabs/TabsContainerView',
		tabHeadView     		: 'views/tabs/TabHeadView',
		tabContentView     		: 'views/tabs/TabContentView',

	},

	packages: [
		{
			name    : 'app-interventions',
			location: '../app-interventions',
			main    : 'main'
		},
		{
			name    : 'app-reservations',
			location: '../app-reservations',
			main    : 'main'
		}
	],

	shim: {
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
	'main', 'underscore', 'underscore.string', 'less'
], function(main, _, _s){

	'use strict';

	_.str = _s;
	_.mixin(_.str.exports());

	main.init('fr');

});