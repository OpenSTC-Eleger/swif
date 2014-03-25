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

		fields: ['id', 'name', 'is_team', 'agent_id', 'team_id', 'technical_service_id', 'planned_hours', 'task_categ_id' ,'supplier_cost', "recur_periodicity" ,"recur_week_monday" ,"recur_week_tuesday", "recur_week_wednesday", "recur_week_thursday", "recur_week_friday" ,"recur_week_saturday" ,"recur_week_sunday", "recur_month_type", "recur_month_absolute", "recur_month_relative_weight", "recur_month_relative_day", "recur_type date_start", "recur_length_type", "date_end recur_occurrence_nb", "occurrence_ids"],

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