define('app-interventions', [
	'app',
	'context',

	'appInterventionsRouter'


], function(app, context, AppInterventionsRouter){

	'use strict';


	return function(){

		app.moduleUrl = app.config.menus.openstc;

		console.log(app.config);


		// Retrieve the routes of the modules //
		$.when(app.loadStaticFile(app.moduleUrl+'/config/routes.json'))
		.done(function(appInterRoutes){
			
			// Stop the router //
			Backbone.history.stop();

			// Prefix all the routes of the module with the module name //
			_.each(appInterRoutes, function(route, index){
				route.url = _.join('/', app.moduleUrl, route.url);
			})


			// Extend the routes //
			app.routes = _.extend(app.routes, appInterRoutes);


			// Create all the Routes of the app //
			_.each(app.routes, function(route, i){
				app.router.route(route.url, route.function);
			});


			// Launch the new Router //
			app.router = new AppInterventionsRouter();
			
			Backbone.history.start({pushState: false});


		})
		.fail(function(e){
			console.error('Unable to load routes file');
			console.error(e);
		})

	}

});