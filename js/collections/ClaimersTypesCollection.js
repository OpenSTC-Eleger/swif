/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'claimerTypeModel'

], function(GenericCollection, ClaimerTypeModel){

	'use strict';


	/******************************************
	* Claimers Types Collection
	*/
	var ClaimersTypesCollection = GenericCollection.extend({

		model       : ClaimerTypeModel,

		url         : '/api/open_object/partner_types',

		fields      : ['id', 'name', 'code', 'actions'],

		default_sort: { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Claimer type collection Initialization');
		}

	});

	return ClaimersTypesCollection;

});