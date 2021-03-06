define('app-patrimoines', [
	'app',

	'appRouter',
	'appPatrimoinesRouter'


], function(app, AppRouter, AppPatrimoinesRouter){

	'use strict';


	return function(){

		// Retrieve the routes and the lang of the modules //
		$.when(app.loadStaticFile(app.menus.openstcpatrimoine+'/config/routes.json'), app.loadStaticFile(app.menus.openstcpatrimoine+'/i18n/'+app.config.lang+'/app-lang.json'))
		.done(function(moduleRoutes, moduleLang){


			// Extends the lang //
			app.lang = _.extend(app.lang, moduleLang[0]);

			// Stop the router //
			Backbone.history.stop();

			// Prefix all the routes of the module with the module name //
			_.each(moduleRoutes[0], function(route){
				route.url = _.join('/', app.menus.openstcpatrimoine, route.url);
			});

			// Extend the routes //
			app.routes = _.extend(app.routes, moduleRoutes[0]);


			// Create all the Routes of the app //
			_.each(app.routes, function(route){
				app.router.route(route.url, route.function);
			});

			
				// Extends the Router functions //
			_.each(AppPatrimoinesRouter.prototype, function(func, funcName){
				AppRouter.prototype[funcName] = func;
			});


			// Launch the new Router //
			app.router = new AppRouter();


			Backbone.history.start({pushState: false});

		})
		.fail(function(){
			console.error('Unable to load routes file');
		});

	};

});