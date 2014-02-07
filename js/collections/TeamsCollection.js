define([
	'genericCollection',
	'teamModel'

], function(GenericCollection, TeamModel){

	'use strict';


	/******************************************
	* Teams Collection
	*/
	var TeamsCollection = GenericCollection.extend({

		model        : TeamModel,

		url          : '/api/openstc/teams',

		fields       : ['id', 'name', 'actions', 'manager_id', 'service_names', 'user_names'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Teams collection Initialization');
		},

	});


	return TeamsCollection;

});