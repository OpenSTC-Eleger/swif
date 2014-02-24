/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

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