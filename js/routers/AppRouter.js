/******************************************
* Application Router
*/
app.Router = Backbone.Router.extend({

	routes: {},

	mainMenus: {
		manageInterventions        : 'gestion-des-interventions',
		reporting                  : 'reporting',
		configuration              : 'configuration',
	},


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
		console.info('############ checkConnect Function ############');

		if (app.models.user.hasAuthToken()) {
			console.info('User has an authToken');
			return true;
		}
		else {
			console.info('User has no auth token');
			return false;
		}
	},



	/** Change the Title of the page
	*/
	setPageTitle: function(title){
		$(document).attr('title', title);
	},




	/******************************************
	* ROUTE FUNCTION
	*/


	/** Redirect to the home page
	*/
	homePageRedirect: function(){
		this.navigate(app.routes.requestsInterventions.baseUrl, {trigger: true, replace: true});
	},



	/** Display the login View
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



	/** About app
	*/
	about: function(){
		// Check if the user is connect //
		if(this.checkConnect()){
			app.views.aboutView = new app.Views.AboutView();
			this.render(app.views.aboutView);
		}
		else{
			this.navigate(app.routes.login.url, {trigger: true, replace: true});
		}
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



	/** Request Details
	*/
	detailsRequest: function (id) {

		// Check if the user is connect //
		if(this.checkConnect()){

			var self = this;


			if(_.isUndefined(app.collections.places)){ app.collections.places = new app.Collections.Places(); }
			if(_.isUndefined(app.collections.claimers)){ app.collections.claimers = new app.Collections.Claimers(); }
			if(_.isUndefined(app.collections.claimersServices)){ app.collections.claimersServices = new app.Collections.ClaimersServices(); }
			if(_.isUndefined(app.collections.claimersTypes)){ app.collections.claimersTypes = new app.Collections.ClaimersTypes(); }
			if(_.isUndefined(app.collections.claimersContacts)){ app.collections.claimersContacts = new app.Collections.ClaimersContacts(); }
			if(_.isUndefined(app.collections.officers)){ app.collections.officers = new app.Collections.Officers(); }


			app.loader('display');

			app.collections.claimers.fetch({
				success: function(){

					$.when(
						app.collections.claimersServices.fetch(),
						app.collections.officers.fetch(),
						app.collections.claimersTypes.fetch(),
						app.collections.claimersContacts.fetch(),
						app.collections.places.fetch()
					)
					.done(function(){
						//load details after places list loaded
						if(_.isUndefined(id)){
							self.request = app.models.request.clear();
							app.views.requestView = new app.Views.RequestView(self.request,  true);
						}
						else{
							self.request = app.collections.requests.get(id);
							app.views.requestView = new app.Views.RequestView(self.request,  false);
						}
						self.render(app.views.requestView);

						app.loader('hide');
					})
					.fail(function(e){
						console.error(e);
					});
				}
			});
		}
		else{
			this.navigate(app.routes.login.url, {trigger: true, replace: true});
		}
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



	/** Interventions details
	*/
	detailsIntervention: function(id) {
		app.views.interventionView = new app.Views.InterventionView( self.intervention, false);
	},



	/** Planning
	*/
	planning: function(id,week){
		
		var self = this;
	
		// Check if the user is connect //
		if(this.checkConnect()){  
			
			// If the id exist we do nothing //
			if(_.isUndefined(id)){
			
			//self.calendarId = 152;
			//self.weekSelected = week;
	
				// Check if the collections is instantiate //
			if(_.isUndefined(app.collections.tasks)){ app.collections.tasks = new app.Collections.Tasks(); }
			if(_.isUndefined(app.collections.interventions)){ app.collections.interventions = new app.Collections.Interventions(); }
			if(_.isUndefined(app.collections.claimersServices)){ app.collections.claimersServices = new app.Collections.ClaimersServices(); }
			if(_.isUndefined(app.collections.officers)){ app.collections.officers = new app.Collections.Officers(); }
			if(_.isUndefined(app.collections.teams)){ app.collections.teams = new app.Collections.Teams(); }
			if(_.isUndefined(app.collections.places)){ app.collections.places = new app.Collections.Places(); }
			if(_.isUndefined(app.collections.categoriesTasks)){ app.collections.categoriesTasks = new app.Collections.CategoriesTasks(); }
			if(_.isUndefined(app.collections.absentTypes)){ app.collections.absentTypes = new app.Collections.AbsentTypes(); }
			if(_.isUndefined(app.collections.equipments)){ app.collections.equipments = new app.Collections.Equipments(); }


			app.loader('display');

			app.collections.tasks.fetch({
				success: function(){

					$.when(
						app.collections.interventions.fetch(),
						app.collections.claimersServices.fetch(),
						app.collections.officers.fetch(),
						app.collections.teams.fetch(),
						app.collections.equipments.fetch(),
						app.collections.places.fetch(),
						app.collections.categoriesTasks.fetch(),
						app.collections.absentTypes.fetch()
					)
					.done(function(){
						//{calendarId: self.calendarId, weekSelected: self.weekSelected}
						app.views.planningView = new app.Views.PlanningView();
						self.render(app.views.planningView);
						//app.loader('hide');
					})
					.fail(function(e){
						console.error(e);
					});
				}
			});

		}
		}
		else{
			this.navigate(app.routes.login.url, {trigger: true, replace: true});
		}
	   
	},



	tasksCheck: function(year, week){
	
		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;
			
			self.yearSelected = year;
			self.weekSelected = week;
			app.views.tasksListView = new app.Views.TasksListView({yearSelected: self.yearSelected, weekSelected: self.weekSelected});
			self.render(app.views.tasksListView);
		}
		else{
			this.navigate(app.routes.login.url, {trigger: true, replace: true});
		}

	},



	detailsTask: function(id){
		console.debug("****************detailsTask********************");
		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;
			var task = app.collections.tasks.get(id);
			self.task = task;   

			if(app.collections.interventions == null ){
				app.collections.interventions = new app.Collections.Interventions();
			}
			
			app.loader('display');
			app.collections.interventions.fetch({
				success: function(){

					if(app.collections.tasks == null ){
						app.collections.tasks = new app.Collections.Tasks();
					}

					app.collections.tasks.fetch({
						success: function(){
						 if(app.collections.officers == null ){
								app.collections.officers = new app.Collections.Officers();
							}
							app.collections.officers.fetch({
								 success: function(){
									if(app.collections.categoriesTasks == null ){
										app.collections.categoriesTasks = new app.Collections.CategoriesTasks();
									}
									app.collections.categoriesTasks.fetch({
										success: function(){
											 if(app.collections.claimersServices == null ){
												app.collections.claimersServices = new app.Collections.ClaimersServices();
											}


											app.collections.claimersServices.fetch({
												success: function(){
													app.views.taskView = new app.Views.TaskView(self.task, false);
													self.render(app.views.taskView);
											   
												},
												complete: function(){
													app.loader('hide');
												}
											});
										}
								   });
								}
							});
						 }
					});
				}
			});
		}
		else{
			this.navigate(app.routes.login.url, {trigger: true, replace: true});
		}
	},



	/** Places management
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
	
	

	/** Services management
	*/
	detailsService: function(id){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;

			// Check if the collections is instantiate //
			if(_.isUndefined(app.collections.claimersServices)){ app.collections.claimersServices = new app.Collections.ClaimersServices(); }


			app.loader('display');

			$.when(
				app.collections.claimersServices.fetch()
			)
			.done(function(){
				if(!_.isUndefined(id)){ 
					self.service = app.collections.claimersServices.get(id);
					var create = false;
				}
				else{
				 	self.service = app.models.service;
				 	var create = true;
				 }

				app.views.serviceView = new app.Views.ServiceView(self.service, create);
				self.render(app.views.serviceView);
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



	/** Categories Tasks management
	*/
	categoriesTasks: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(_.isUndefined(app.collections.categoriesTasks)){ app.collections.categoriesTasks = new app.Collections.CategoriesTasks(); }
			if(_.isUndefined(app.collections.claimersServices)){ app.collections.claimersServices = new app.Collections.ClaimersServices(); }


			app.loader('display');

			$.when(
				app.collections.claimersServices.fetch(),
				app.collections.categoriesTasks.fetch()
				
			)
			.done(function(){
				app.views.categoriesTasksListView = new app.Views.CategoriesTasksListView({page: self.page});
				self.render(app.views.categoriesTasksListView);

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



	/** Categories Interventions management
	*/
	categoriesRequests: function(search, sort, page){

		var params = {};

		if(!_.isNull(search)){ params.search = search; }
		if(!_.isNull(sort))  { params.sort = sort; }
		if(!_.isNull(page))  { params.page = page; }

		app.views.categoriesRequestsListView = new app.Views.CategoriesRequestsListView(params);
	},



	/** Teams management
	*/
	teams: function(id, search, sort, page){

		var params = {};

		if(!_.isNull(id))    { params.id = id; }
		if(!_.isNull(search)){ params.search = search; }
		if(!_.isNull(sort))  { params.sort = sort; }
		if(!_.isNull(page))  { params.page = page; }

		app.views.teamsListView = new app.Views.TeamsListView(params);
	},



	/** Claimers management
	*/
	claimers: function(search, sort, page){

		var params = {};

		if(!_.isNull(search)){ params.search = search; }
		if(!_.isNull(sort))  { params.sort = sort; }
		if(!_.isNull(page))  { params.page = page; }

		app.views.claimersListView = new app.Views.ClaimersListView(params);
	},



	/** Types management
	*/
	types: function(page){      

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;

			self.page = page ? parseInt(page, 10) : 1;

			if(_.isUndefined(app.collections.claimersTypes)){ app.collections.claimersTypes = new app.Collections.ClaimersTypes(); }

			app.loader('display');

			$.when(
				app.collections.claimersTypes.fetch()
			)
			.done(function(){
				app.views.claimersTypesView = new app.Views.ClaimersTypesView({page: self.page});
				self.render(app.views.claimersTypesView);
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



	/** Abstent types
	*/
	absentTypes: function(page){

		// Check if the user is connect //
		if(this.checkConnect()){
			var self = this;


			self.page = page ? parseInt(page, 10) : 1;

			// Check if the collections is instantiate //
			if(_.isUndefined(app.collections.absentTypes)){ app.collections.absentTypes = new app.Collections.AbsentTypes(); }


			app.loader('display');

			$.when(
				app.collections.absentTypes.fetch()
			)
			.done(function(){
				app.views.absentTypesListView = new app.Views.AbsentTypesListView({page: self.page});
				self.render(app.views.absentTypesListView);
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



	/** equipments
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
