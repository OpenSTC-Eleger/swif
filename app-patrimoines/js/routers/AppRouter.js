define([
	'app',
	'moment',
	'contractsListView',
	'formContractView'

], function(app, moment, ContractsListView, FormContractView){

	'use strict';


	/******************************************
	* Application Router
	*/
	return Backbone.Router.extend({
		
		contractsList: function(search, filter, sort, page) {

			var params = this.setContext({search: search,  filter : filter, sort: sort, page: page});

			app.views.contractsListView = new ContractsListView(params);
		},
	
		contractForm: function(id) {
	
			var params = this.setContext({id: id});
			app.views.contractFormView = new FormContractView(params);
		}
	});
});