define('app-reservations', [
	'app',

	'appRouter',
	'appReservationsRouter'


], function(app, AppRouter, AppReservationsRouter){

	'use strict';


	return function(){

		// Retrieve the routes and the lang of the modules //
		$.when(app.loadStaticFile(app.menus.openresa+'/config/routes.json'), app.loadStaticFile(app.menus.openresa+'/i18n/'+app.config.lang+'/app-lang.json'))
		.done(function(moduleRoutes, moduleLang){


			// Extends the lang //
			app.lang = _.extend(app.lang, moduleLang[0]);

			// Stop the router //
			Backbone.history.stop();

			// Prefix all the routes of the module with the module name //
			_.each(moduleRoutes[0], function(route, index){
				route.url = _.join('/', app.menus.openresa, route.url);
			})

			// Extend the routes //
			app.routes = _.extend(app.routes, moduleRoutes[0]);


			// Create all the Routes of the app //
			_.each(app.routes, function(route, i){
				app.router.route(route.url, route.function);
			});

			
				// Extends the Router functions //
			_.each(AppReservationsRouter.prototype, function(func, funcName, e){
				AppRouter.prototype[funcName] = func;
			});


			// Launch the new Router //
			app.router = new AppRouter();


			Backbone.history.start({pushState: false});

		})
		.fail(function(e){
			console.error('Unable to load routes file');
		})

	}

});