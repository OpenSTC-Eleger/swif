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