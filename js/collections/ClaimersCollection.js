/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'claimerModel'

], function(GenericCollection, ClaimerModel){

	'use strict';


	/******************************************
	* Claimers Collection
	*/
	var ClaimersCollection = GenericCollection.extend({

		key         : 'provider',

		model       : ClaimerModel,

		url         : '/api/open_object/partners',

		fields      : ['id', 'name', 'address', 'category_id', 'contract_ids', 'email', 'phone', 'service_id', 'task_ids', 'technical_service_id', 'technical_site_id', 'title', 'type_id', 'user_id'],

		default_sort: { by: 'name', order: 'ASC' },

		logo        : 'fa-truck',



		/** Collection Initialization
		*/
		initialize : function() {
			//console.log('Claimer collection Initialization');
		},

	});


	return ClaimersCollection;

});