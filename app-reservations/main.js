define('app-reservations', [
	'app',

	'appReservationsRouter'


], function(app, AppInterventionsRouter){

	'use strict';


	return function(){

		app.moduleUrl = app.config.menus.openstc;


		// Retrieve the routes and the lang of the modules //
		$.when(app.loadStaticFile(app.moduleUrl+'/config/routes.json'), app.loadStaticFile(app.moduleUrl+'/i18n/'+app.config.lang+'/app-lang.json'))
		.done(function(moduleRoutes, moduleLang){


			// Extends the lang //
			app.lang = _.extend(app.lang, moduleLang[0]);

			// Stop the router //
			Backbone.history.stop();

			// Prefix all the routes of the module with the module name //
			_.each(moduleRoutes[0], function(route, index){
				route.url = _.join('/', app.moduleUrl, route.url);
			})

			// Extend the routes //
			app.routes = _.extend(app.routes, moduleRoutes[0]);


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
		})

	}

});