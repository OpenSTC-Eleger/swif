define([
	'app',
	'appRouter',

	'requestsListView'

], function(app, AppRouter, RequestsListView){

	'use strict';


	/******************************************
	* Application Router
	*/
	var router = AppRouter.extend({



		/** Requests List
		*/
		requestsList: function(search, filter, sort, page) {

			var params = this.setContext({search: search, filter : filter, sort : sort, page : page});

			app.views.requestsListView = new RequestsListView(params);
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



		/** Configuration
		*/

		/** Categories Request List
		*/
		categoriesRequests: function(search, sort, page){

			var params = {};

			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.categoriesRequestsListView = new app.Views.CategoriesRequestsListView(params);
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



		/** Abstent types List
		*/
		absentTypes: function(search, sort, page){

			var params = {};

			if(!_.isNull(search)){ params.search = search; }
			if(!_.isNull(sort))  { params.sort = sort; }
			if(!_.isNull(page))  { params.page = page; }

			app.views.absentTypesListView = new app.Views.AbsentTypesListView(params);
		}

	});

return router;

});