define([
	'app',
	'context',

	'headerView',
	'footerView',
	'loginView',
	'notFoundView',
	'dashboardView'

], function(app, context, HeaderView, FooterView, LoginView, NotFoundView, DashboardView){

	'use strict';


	/******************************************
	* Application Router
	*/
	var router = Backbone.Router.extend({


		mainMenus: {
			manageInterventions        : 'gestion-des-interventions',
			reporting                  : 'reporting',
			configuration              : 'configuration',
		},


		/******************************************
		* GENERIC FUNCTION
		*/

		/** Router Initialization
		*/
		initialize: function () {
			var self = this;


			// Create all the Routes of the app //
			_.each(app.routes, function(route, i){
				self.route(route.url, route.function);
			});


			// Header, Footer Initialize //    	
			app.views.headerView = new HeaderView();
			app.views.footerView = new FooterView();
		},



		/** Render a view by undelegating all Event
		*/
		render: function (view) {

			// Close the current view //
			if (this.currentView) {
				if (this.currentView.$el) this.currentView.undelegateEvents();
				this.currentView.$el = (this.currentView.el instanceof $) ? this.currentView.el : $(this.currentView.el);
				this.currentView.el = this.currentView.$el[0];
			}

			// render the new view //
			view.render();

			//Set the current view //
			this.currentView = view;

			return this;
		},



		/** Check if the User is connect
		*/
		checkConnect: function () {

			if (app.models.user.hasAuthToken()) {
				console.info('#### User has an authToken ####');
				return true;
			}
			else {
				console.info('#### User has no authToken ####');
				return false;
			}
		},



		/** Change the Title of the page
		*/
		setPageTitle: function(title){
			$(document).attr('title', title);
		},




		/******************************************
		* ROUTES FUNCTION
		*/

		/** Redirect to the home page
		*/
		homePageRedirect: function(){
			if(!this.checkConnect()){
				this.navigate(app.routes.login.url, {trigger: true, replace: true});
			}
			else{
				this.navigate(_.strLeft(app.routes.dashboard.url, '('), {trigger: true, replace: true});
			}
		},



		/** Login View
		*/
		login: function(){
			// Check if the user is connect //
			if(!this.checkConnect()){
				app.views.loginView = new LoginView({ model: app.models.user });
				this.render(app.views.loginView);
			}
			else{
				this.navigate(app.routes.home.url, {trigger: true, replace: true});
			}
		},



		/** Logout the user
		*/
		logout: function(){
			app.models.user.logout();
		},



		/** About the App
		*/
		about: function(){
			app.views.aboutView = new app.Views.AboutView();
			this.render(app.views.aboutView);
		},



		/** About the App
		*/
		dashboard: function(){
			app.views.dashboardView = new DashboardView();
			this.render(app.views.dashboardView);
		},



		/** Requests List
		*/
		requestsList: function(search, filter, sort, page) {

			// Reset the context //
			//context = {};

			if(!_.isNull(search))  { context.search = search; }else{ delete(context.search); }
			if(!_.isNull(filter))  { context.filter = filter; }else{ delete(context.filter); }
			if(!_.isNull(sort))    { context.sort = sort; }else{ delete(context.sort); }
			if(!_.isNull(page))    { context.page = page; }else{ delete(context.page); }


			//app.views.requestsListView = new app.Views.RequestsListView(params);
			this.loadModule('app-interventions');
		},


		loadModule: function (module) {
            require([module], function (module) {
                module();
            });
        },



		/** Interventions list
		*/
		interventions: function(search, filter, sort, page){

			var params = {};

			if(!_.isNull(search)){params.search = search}
			if(!_.isNull(filter)){params.filter = filter}
			if(!_.isNull(sort)){params.sort = sort}
			if(!_.isNull(page)){params.page = page}

			app.views.interventions = new app.Views.InterventionsListView(params);
		},



		/** Planning
		*/
		planning: function(officer, team, year, week){
			
			var params = {};
			if(!_.isNull(officer)){params.officer = officer}
			if(!_.isNull(team)){params.team = team}
			if(!_.isNull(year)){params.year = year}
			if(!_.isNull(week)){params.week = week}
			
			app.views.planning = new app.Views.PlanningView(params);	   
		},



		/** Tasks List 
		*/
		tasksCheck: function(search, filter, sort, page, year, week){
			var params = {};
			if(!_.isNull(search)){params.search = search}
			if(!_.isNull(filter)){params.filter = filter}
			if(!_.isNull(sort)){params.sort = sort}
			if(!_.isNull(page)){params.page = page}
			if(!_.isNull(year)){params.year = year}
			if(!_.isNull(week)){params.week = week}
			
			app.views.tasksListView = new app.Views.TasksListView(params);
			this.render(app.views.tasksListView);
		},



		/** Places List
		*/
		places: function(search, sort, page){

			var params = {};

			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.placesListView = new app.Views.PlacesListView(params);
		},



		/** Services management
		*/
		services: function(search, sort, page){      

			var params = {};

			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.servicesListView = new app.Views.ServicesListView(params);
		},
		
		

		/** Categories Tasks List
		*/
		categoriesTasks: function(search, sort, page){      

			var params = {};

			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.categoriesTasksListView = new app.Views.CategoriesTasksListView(params);
		},



		/** Categories Request List
		*/
		categoriesRequests: function(search, sort, page){

			var params = {};

			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.categoriesRequestsListView = new app.Views.CategoriesRequestsListView(params);
		},



		/** Teams List
		*/
		teams: function(id, search, sort, page){

			var params = {};

			if(!_.isNull(id))    { params.id = id; }
			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.teamsListView = new app.Views.TeamsListView(params);
		},



		/** Claimers List
		*/
		claimers: function(search, sort, page){

			var params = {};

			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.claimersListView = new app.Views.ClaimersListView(params);
		},



		/** Claimer Type List
		*/
		claimerTypes: function(search, sort, page){

			var params = {};

			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.claimersTypesListView = new app.Views.ClaimersTypesListView(params);
		},



		/** Abstent types List
		*/
		absentTypes: function(search, sort, page){

			var params = {};

			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.absentTypesListView = new app.Views.AbsentTypesListView(params);
		},



		/** Equipments List
		*/

		equipments: function(search, filter, sort, page){
			var params = {};
			if(!_.isNull(search)){params.search = search}
			if(!_.isNull(filter)){params.filter = filter}
			if(!_.isNull(sort)){params.sort = sort}
			if(!_.isNull(page)){params.page = page}
			app.views.equipmentsListView = new app.Views.EquipmentsListView(params);
		},



		/** 404 Not Found
		*/
		notFound: function(page){

			app.views.notFoundView = new NotFoundView();
			this.render(app.views.notFoundView);
		}

	});


return router;

});