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
			if(this.parentModel && !this.parentModel.isNew()){
				ret = ret.replace(':purchase_id', this.parentModel.getId().toString());
			}
			return ret;
		},
		
		fields: ['id', 'date', 'move_ids'],

		default_sort: { by: 'id', order: 'ASC' },
		
		specialCpt : 0,
		
		initialize: function(){
			var params = arguments[0] || {};
			this.parentModel = params.parentModel || null;
		}
	});
});