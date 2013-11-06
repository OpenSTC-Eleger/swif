/******************************************
* Application Router
*/
app.Router = Backbone.Router.extend({


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

		app.views.notFoundView = new app.Views.NotFoundView();
		this.render(app.views.notFoundView);
	}

});