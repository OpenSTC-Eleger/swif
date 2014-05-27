define([
	'app',
	'genericCollection',
	'analyticAccountModel'

], function(app, GenericCollection, AnalyticAccountModel){

	'use strict';

	/******************************************
	* Contracts Collection
	*/
	return GenericCollection.extend({
	
		model : AnalyticAccountModel,
		
		url   : '/api/open_achats_stock/analytic_accounts',

		fields: ['id', 'name', 'parent_id', 'actions'],

		default_sort: { by: 'name', order: 'ASC' },
		
		specialCpt : 0,
	});
});