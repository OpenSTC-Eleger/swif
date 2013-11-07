define([
	'app',
	'appRouter',

	'context',

	'requestsListView'

], function(app, AppRouter, context, RequestsListView){

	'use strict';


	/******************************************
	* Application Router
	*/
	var router = AppRouter.extend({



		/** Requests List
		*/
		requestsList: function(search, filter, sort, page) {

			// Reset the context //
			//context = {};

			if(!_.isNull(search))  { context.search = search; }else{ delete(context.search); }
			if(!_.isNull(filter))  { context.filter = filter; }else{ delete(context.filter); }
			if(!_.isNull(sort))    { context.sort = sort; }else{ delete(context.sort); }
			if(!_.isNull(page))    { context.page = page; }else{ delete(context.page); }


			app.views.requestsListView = new RequestsListView(context);
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
		}

	});

return router;

});