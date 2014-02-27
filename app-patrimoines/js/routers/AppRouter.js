define([
	'app',
	'moment',
	'contractsListView'

], function(app, moment, ContractsListView){

	'use strict';


	/******************************************
	* Application Router
	*/
	return Backbone.Router.extend({
		
		contractsList: function(search, filter, sort, page) {

			var params = this.setContext({search: search,  filter : filter, sort: sort, page: page});

			app.views.contractsListView = new ContractsListView(params);
		}
		
	});
});