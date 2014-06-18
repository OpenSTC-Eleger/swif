define([
	'app',
	'genericCollection',
	'partialPickingModel'

], function(app, GenericCollection, PartialPickingModel){

	'use strict';

	/******************************************
	* Contracts Collection
	*/
	return GenericCollection.extend({
	
		model : PartialPickingModel,
		
		restUrl   : '/api/open_achats_stock/purchases/:purchase_id/partial_pickings',
		
		url: function(){
			var ret = this.restUrl;
			if(this.nestedModel && !this.nestedModel.isNew()){
				ret = ret.replace(':purchase_id', this.nestedModel.getId().toString());
			}
			return ret;
		},
		
		fields: ['id', 'date', 'move_ids'],

		default_sort: { by: 'id', order: 'ASC' },
		
		specialCpt : 0,
		
		initialize: function(){
			var params = arguments[0] || {};
			this.nestedModel = params.nestedModel || null;
		}
	});
});