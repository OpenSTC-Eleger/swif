/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'claimerContactModel'

], function(GenericCollection, ClaimerContactModel){

	'use strict';


	/******************************************
	* Claimers Contacts Collection
	*/
	var ClaimersContactsCollection = GenericCollection.extend({

		model       : ClaimerContactModel,
		
		url         : '/api/open_object/partner_addresses',
		
		fields      : ['id', 'name', 'email', 'function', 'livesIn', 'mobile', 'partner_id', 'phone', 'street', 'type', 'user_id', 'zip', 'city'],
		
		default_sort: { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize : function() {
			//console.log('Claimer Contact collection Initialization');
		},

	});

	return ClaimersContactsCollection;

});