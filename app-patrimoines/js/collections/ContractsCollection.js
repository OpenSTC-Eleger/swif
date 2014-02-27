define([
	'app', 
	'genericCollection',
	'contractModel'

], function(app, GenericCollection, ContractModel){

	'use strict';

	/******************************************
	* Contracts Collection
	*/
	var contracts = GenericCollection.extend({
	
		model : ContractModel,
		
		url   : "/api/openresa/bookings",

		fields: ['id', 'name'],




		default_sort: { by: '', order: '' },
		
		specialCpt : 0,
			

		/** Get the number of Booking that the user have to deal
		*/
		specialCount: function(){
			var self = this;
	
			// Construct a domain  //

			var domain = [
					 { field : 'state', operator : '=', value : ContractModel.status.remplir.key }					 
				];

	
			return $.ajax({
				url      : this.url,
				method   : 'HEAD',
				dataType : 'text',
				data     : {filters: app.objectifyFilters(domain)},
				success  : function(data, status, request){
					var contentRange = request.getResponseHeader("Content-Range")
					self.specialCpt = contentRange.match(/\d+$/);
				}
			});
			
		},
		
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
	
	return contracts;

});