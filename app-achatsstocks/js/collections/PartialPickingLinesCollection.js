define([
	'app',
	'genericCollection',
	'partialPickingLineModel'

], function(app, GenericCollection, PartialPickingLineModel){

	'use strict';

	/******************************************
	* Contracts Collection
	*/
	return GenericCollection.extend({
	
		model : PartialPickingLineModel,
		
		restUrl   : '/api/open_achats_stock/partial_pickings/:partial_picking_id/partial_picking_lines',
		
		url: function(){
			var ret = this.restUrl;
			if(this.nestedModel && !this.nestedModel.isNew()){
				ret = ret.replace(':partial_picking_id', this.nestedModel.getId().toString());
			}
			return ret;
		},

		fields: ['id', 'product_id', 'quantity'],

		default_sort: { by: 'id', order: 'ASC' },
		
		specialCpt : 0,
		
		
		initialize: function(){
			var params = arguments[0] || {};
			this.nestedModel = params.nestedModel || null;
		}
	});
});