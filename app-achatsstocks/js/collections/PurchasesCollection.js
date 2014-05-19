define([
	'app',
	'genericCollection',
	'purchaseModel'

], function(app, GenericCollection, PurchaseModel){

	'use strict';

	/******************************************
	* Contracts Collection
	*/
	return GenericCollection.extend({
	
		model : PurchaseModel,
		
		url   : '/api/open_achats_stock/purchases',

		fields: ['id', 'name', 'date_order', 'description', 'service_id', 'partner_id', 'amount_total', 'state', 'validation', 'validation_order', 'actions', 'check_dst', 'check_elu'],

		default_sort: { by: 'validation_order', order: 'ASC' },
		
		specialCpt : 0,
		
		advanced_searchable_fields: [],


		/** Get the number of Booking that the user have to deal
		*/
		specialCount: function(){
			var self = this;
	
			// Construct a domain  //

			var domain = [];

	
			return $.ajax({
				url      : this.url,
				method   : 'HEAD',
				dataType : 'text',
				data     : {filters: app.objectifyFilters(domain)},
				success  : function(data, status, request){
					var contentRange = request.getResponseHeader('Content-Range');
					self.specialCpt = contentRange.match(/\d+$/);
				}
			});
			
		}
		
		/** Collection Sync
		*/
//		sync: function(method, model, options){
//	
//			if(_.isUndefined(options.data.fields)){
//				options.data.fields = this.fields;	
//			}		
//			
//			return $.when(this.count(options), this.specialCount(), Backbone.sync.call(this,method,this,options));
//		}
//	
//	});
	});
});