/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'claimerServiceModel'

], function(GenericCollection, ClaimerServiceModel){

	'use strict';


	/******************************************
	* Claimers Services Collection
	*/
	var ClaimersServicesCollection = GenericCollection.extend({

		model        : ClaimerServiceModel,

		url          : '/api/openstc/departments',

		fields       : ['id', 'name', 'code', 'service_id', 'technical', 'manager_id', 'user_ids', 'actions'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize : function() {
			//console.log('Claimer Services collection Initialization');
		},

	});

	return ClaimersServicesCollection;

});