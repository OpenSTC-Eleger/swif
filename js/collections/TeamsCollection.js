/*!
 * SWIF-OpenSTC
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

		key          : 'team',

		model        : TeamModel,

		url          : '/api/openstc/teams',

		fields       : ['id', 'name', 'actions', 'manager_id', 'service_names', 'user_names'],

		default_sort : { by: 'name', order: 'ASC' },

		logo         : 'fa-users',



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Teams collection Initialization');
		},

	});


	return TeamsCollection;

});