/******************************************
* Application Router
*/
app.Router = Backbone.Router.extend({


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
		app.views.headerView = new app.Views.HeaderView();
		app.views.footerView = new app.Views.FooterView();
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
		this.navigate(_.strLeft(app.routes.requestsInterventions.url, '('), {trigger: true, replace: true});
	},



	/** Login View
	*/
	login: function(){
		// Check if the user is connect //
		if(!this.checkConnect()){
			app.views.loginView = new app.Views.LoginView({ model: app.models.user });
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



	/** Requests List
	*/
	requestsList: function(search, filter, sort, page) {

		var params = {};

		if(!_.isNull(search))  { params.search = search; }
		if(!_.isNull(filter))  { params.filter = filter; }
		if(!_.isNull(sort))    { params.sort = sort; }
		if(!_.isNull(page))    { params.page = page; }

		app.views.requestsListView = new app.Views.RequestsListView(params);
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
	planning: function(officer, team, year, week, search, filter, sort, page ){
		
		var params = {};
		if(!_.isNull(search)){params.search = search}
		if(!_.isNull(filter)){params.filter = filter}
		if(!_.isNull(sort)){params.sort = sort}
		if(!_.isNull(page)){params.page = page}
		if(!_.isNull(officer)){params.officer = officer}
		if(!_.isNull(team)){params.team = team}
		if(!_.isNull(year)){params.year = year}
		if(!_.isNull(week)){params.week = week}
		
		app.views.planning = new app.Views.PlanningView(params);	   
	},



	/** Tasks List 
	*/
	tasksCheck: function(year, week){
	
		var yearSelected = year;
		var weekSelected = week;

		app.views.tasksListView = new app.Views.TasksListView({yearSelected: yearSelected, weekSelected: weekSelected});
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
	services: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;


			// Check if the collections is instantiate //
			if(_.isUndefined(app.collections.claimersServices)){ app.collections.claimersServices = new app.Collections.ClaimersServices(); }
			if(_.isUndefined(app.collections.officers)){ app.collections.officers = new app.Collections.Officers(); }
			if(_.isUndefined(app.collections.stcGroups)){ app.collections.stcGroups = new app.Collections.STCGroups(); }


			app.loader('display');

			$.when(
				app.collections.claimersServices.fetch(),
				app.collections.officers.fetch(),
				app.collections.stcGroups.fetch()
			)
			.done(function(){
				app.views.servicesListView = new app.Views.ServicesListView({page: self.page});
				self.render(app.views.servicesListView);
				app.loader('hide');
			})
			.fail(function(e){
				console.error(e);
			});

		}
		else{
			this.navigate(app.routes.login.url, {trigger: true, replace: true});
		}
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
	equipments: function(page){

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;

			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(_.isUndefined(app.collections.equipments)){ app.collections.equipments = new app.Collections.Equipments(); }
			if(_.isUndefined(app.collections.claimersServices)){ app.collections.claimersServices = new app.Collections.ClaimersServices(); }


			app.loader('display');

			$.when(
				app.collections.equipments.fetch(),
				app.collections.claimersServices.fetch()
			)
			.done(function(){
				app.views.equipmentsListView = new app.Views.EquipmentsListView({page: self.page});
				self.render(app.views.equipmentsListView);

				app.loader('hide');
			})
			.fail(function(e){
				console.error(e);
			});
		}
		else{
			this.navigate(app.routes.login.url, {trigger: true, replace: true});
		}
	},



	/** 404 Not Found
	*/
	notFound: function(page){

		console.warn('Page not Found');

		app.views.notFoundView = new app.Views.NotFoundView();
		this.render(app.views.notFoundView);
	}

});
