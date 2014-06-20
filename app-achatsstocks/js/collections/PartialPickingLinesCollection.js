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
		
		//restUrl   : '/api/open_achats_stock/partial_pickings/:partial_picking_id/partial_picking_lines',
		
//		url: function(){
//			var ret = this.restUrl;
//			if(this.parentModel && !this.parentModel.isNew()){
//				ret = ret.replace(':partial_picking_id', this.parentModel.getId().toString());
//			}
//			return ret;
//		},
		
		url: '/api/open_achats_stock/partial_picking_lines',

		fields: ['id', 'product_id', 'quantity'],

		default_sort: { by: 'id', order: 'ASC' },
		
		specialCpt : 0,
		
		
		initialize: function(){
			var params = arguments[0] || {};
			this.parentModel = params.parentModel || null;
		}
	});
});