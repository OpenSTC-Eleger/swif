define('app-interventions', [
	'app',
	'context',

	'requestsListView'

], function(app, context, RequestsListView){

	'use strict';


	return function(){

		app.views.requestsListView = new RequestsListView(context);
	}

});