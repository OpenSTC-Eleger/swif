define([
	'app',

	'requestsListView',
	'categoriesRequestsListView',
	'categoriesTasksListView',
	'absentTypesListView',
	'planningView',
	'interventionsListView',
	'tasksListView',

], function(app, RequestsListView, CategoriesRequestsListView, CategoriesTasksListView, AbsentTypesListView, PlanningView, InterventionsListView, TasksListView){

	'use strict';


	/******************************************
	* Application Router
	*/
	var router = Backbone.Router.extend({



		/** Requests List
		*/
		requestsList: function(search, advancedSearch, sort, page) {

			var params = this.setContext({search: search,  advancedSearch : advancedSearch, sort : sort, page : page});

			app.views.requestsListView = new RequestsListView(params);
		},



		/** Interventions list
		*/
		interventions: function(search, advancedSearch, sort, page){

			var params = this.setContext({search: search,  advancedSearch : advancedSearch, sort : sort, page : page});

			app.views.interventions = new InterventionsListView(params);
		},



		/** Planning
		*/
		planning: function(officer, team, year, week){

			var params = this.setContext({officer: officer, team : team, year : year, week : week});

			app.views.planning = new PlanningView(params);
		},



		/** Tasks List 
		*/
		tasksCheck: function(search, filter, sort, page, year, week){
			
			var params = this.setContext({search: search, filter : filter, sort : sort, page : page, year: year, week:week});
			
			app.views.tasksListView = new TasksListView(params);
			this.render(app.views.tasksListView);
		},



		/** Configuration
		*/

		/** Categories Request List
		*/
		categoriesRequests: function(search, sort, page){
			
			var params = this.setContext({search: search, sort : sort, page : page});

			app.views.categoriesRequestsListView = new CategoriesRequestsListView(params);

		},



		/** Categories Tasks List
		*/
		categoriesTasks: function(search, sort, page){      
			
			var params = this.setContext({search: search, sort : sort, page : page});

			app.views.categoriesTasksListView = new CategoriesTasksListView(params);
			
		},



		/** Abstent types List
		*/
		absentTypes: function(search, sort, page){
			
			var params = this.setContext({search: search, sort : sort, page : page});

			app.views.absentTypesListView = new AbsentTypesListView(params);
			
		}

	});

return router;

});