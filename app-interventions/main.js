define('app-interventions', [
	'app',
	'context',



], function(app, context){

	'use strict';


	return function(){

		console.log('Je suis le module interventions');

		// Retrieve the routes of the modules //
		$.when(app.loadStaticFile('app-interventions/config/routes.json'))
		.done(function(data){
			

			Backbone.history.stop();

			app.routes = _.extend(app.routes, data);

			// Create all the Routes of the app //
			_.each(app.routes, function(route, i){
				app.router.route(route.url, route.function);
			});

			
			Backbone.history.start({pushState: false});
			//app.views.requestsListView = new RequestsListView(context);
		

		})
		.fail(function(){
			console.log('Error append');	
		})



		//app.views.requestsListView = new RequestsListView(context);
	}

});