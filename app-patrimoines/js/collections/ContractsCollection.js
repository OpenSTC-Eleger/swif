define([
	'app',
	'genericCollection',
	'contractModel'

], function(app, GenericCollection, ContractModel){

	'use strict';

	/******************************************
	* Contracts Collection
	*/
	return GenericCollection.extend({
	
		model : ContractModel,
		
		url   : '/api/openpatrimoine/contracts',

		fields: ['id', 'name', 'actions', 'date_start_order', 'date_end_order', 'internal_inter', 'provider_name', 'patrimoine_is_equipment', 'patrimoine_name', 'state', 'description', 'deadline_delay', 'type_renewal', 'category_id', 'delay_passed'],

		default_sort: { by: 'id', order: 'DESC' },
		
		specialCpt : 0,
			

		/** Get the number of Booking that the user have to deal
		*/
		specialCount: function(){
			var self = this;
	
			// Construct a domain  //

			var domain = [
					{field:'state', operator:'=', value:ContractModel.status.remplir.key}
				];

	
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