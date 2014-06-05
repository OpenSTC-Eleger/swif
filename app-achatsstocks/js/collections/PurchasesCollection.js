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

		fields: ['id', 'name', 'date_order', 'description', 'service_id', 'partner_id', 'amount_total', 'state', 'validation', 'state_order', 'actions', 'check_dst', 'check_elu', 'user_id', 'attach_invoices', 'attach_not_invoices', 'attach_waiting_invoice_ids', 'engage_to_treat', 'account_analytic_id', 'order_line', 'amount_untaxed', 'amount_tax', 'shipped_rate'],

		default_sort: { by: 'state_order', order: 'ASC' },
		
		specialCpt : 0,
		
		advanced_searchable_fields: [{key: 'engage_to_treat', label: 'Engage to treat'}],


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