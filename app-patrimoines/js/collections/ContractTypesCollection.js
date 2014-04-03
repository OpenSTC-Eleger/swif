define([
	'app',
	'genericCollection',
	'contractTypesModel'

], function(app, GenericCollection, ContractTypesModel){

	'use strict';

	/******************************************
	* Contracts Collection
	*/
	return GenericCollection.extend({
	
		model : ContractTypesModel,
		
		url   : '/api/openpatrimoine/contract_types',

		fields: ['id', 'name', 'code', 'parent_id', 'actions'],

		default_sort: { by: 'name', order: 'ASC' },
		
		specialCpt : 0,

	});
});