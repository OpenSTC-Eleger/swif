define([
	'app',
	'genericCollection',
	'contractLineModel'

], function(app, GenericCollection, ContractLineModel){

	'use strict';

	/******************************************
	* Contracts Collection
	*/
	return GenericCollection.extend({
	
		model : ContractLineModel,
		
		url   : '/api/openpatrimoine/contract_lines',

		fields: ['id', 'name', 'is_team', 'agent_id', 'team_id', 'technical_service_id'],

		default_sort: { by: 'id', order: 'DESC' },
		
		specialCpt : 0,
			

		/** Get the number of Booking that the user have to deal
		*/
		specialCount: function(){
			var self = this;
	
			// Construct a domain  //

			var domain = [
					{field:'state', operator:'=', value:ContractLineModel.status.remplir.key}
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